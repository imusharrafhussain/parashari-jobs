import express from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { getDB } from '../config/database.js'
import { sendOTPEmail } from '../services/emailService.js'
import { otpSendLimiter, otpVerifyLimiterIP, otpVerifyLimiterEmail } from '../middleware/rateLimiter.js'
import { validateOTPSend, validateOTPVerify } from '../middleware/validators.js'
import AppError from '../utils/AppError.js'
import logger from '../utils/logger.js'

const router = express.Router()

// Generate 6-digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString()
}

// POST /api/otp/send - Send OTP to email
router.post('/send', otpSendLimiter, validateOTPSend, async (req, res, next) => {
    try {
        const { email } = req.body

        const db = getDB()
        const otps = db.collection('otps')

        // Generate OTP
        const otp = generateOTP()

        // Hash OTP before storing
        const otpHash = await bcrypt.hash(otp, 10)

        // Delete any existing OTP for this email
        await otps.deleteMany({ email })

        // Store OTP with 10-minute expiry and brute-force protection fields
        await otps.insertOne({
            email,
            otpHash,
            failedAttempts: 0,
            locked: false,
            lockedAt: null,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            createdAt: new Date()
        })

        // Send OTP via email
        await sendOTPEmail(email, otp)

        logger.info(`OTP sent to ${email}`)

        res.json({ success: true, message: 'OTP sent successfully' })
    } catch (error) {
        logger.error('Send OTP error:', error)
        next(new AppError('Failed to send OTP', 500))
    }
})

// POST /api/otp/verify - Verify OTP
// Apply BOTH IP-based and email-based rate limiting
router.post('/verify', otpVerifyLimiterIP, otpVerifyLimiterEmail, validateOTPVerify, async (req, res, next) => {
    try {
        const { email, otp } = req.body

        const db = getDB()
        const otps = db.collection('otps')

        // Find OTP record
        const otpRecord = await otps.findOne({ email })

        // Generic error message - never reveal if OTP exists, is locked, or is wrong
        const genericError = 'Invalid or expired OTP'

        if (!otpRecord) {
            logger.warn(`OTP verification failed - no record found for ${email}`)
            return res.json({ success: false, verified: false, message: genericError })
        }

        // Check if OTP is locked (too many failed attempts)
        if (otpRecord.locked) {
            logger.warn(`OTP verification failed - locked for ${email}`)
            // Delete locked OTP
            await otps.deleteOne({ email })
            return res.json({ success: false, verified: false, message: genericError })
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            logger.warn(`OTP verification failed - expired for ${email}`)
            await otps.deleteOne({ email })
            return res.json({ success: false, verified: false, message: genericError })
        }

        // Verify OTP
        const isValid = await bcrypt.compare(otp, otpRecord.otpHash)

        if (!isValid) {
            // Increment failed attempts
            const newFailedAttempts = otpRecord.failedAttempts + 1

            logger.warn(`OTP verification failed - invalid OTP for ${email} (attempt ${newFailedAttempts}/5)`)

            // Lock if 5 or more failed attempts
            if (newFailedAttempts >= 5) {
                await otps.updateOne(
                    { email },
                    {
                        $set: {
                            locked: true,
                            lockedAt: new Date(),
                            failedAttempts: newFailedAttempts
                        }
                    }
                )
                logger.warn(`OTP locked for ${email} - too many failed attempts`)
            } else {
                // Just increment the counter
                await otps.updateOne(
                    { email },
                    { $set: { failedAttempts: newFailedAttempts } }
                )
            }

            return res.json({ success: false, verified: false, message: genericError })
        }

        // Valid OTP - delete it after successful verification
        await otps.deleteOne({ email })

        logger.info(`OTP verified successfully for ${email}`)

        res.json({ success: true, verified: true, message: 'OTP verified successfully' })
    } catch (error) {
        logger.error('Verify OTP error:', error)
        next(new AppError('Failed to verify OTP', 500))
    }
})

export default router

