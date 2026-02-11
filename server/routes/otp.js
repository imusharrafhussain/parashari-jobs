import express from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { getDB } from '../config/database.js'
import { sendOTPEmail } from '../services/emailService.js'

const router = express.Router()

// Generate 6-digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString()
}

// POST /api/otp/send - Send OTP to email
router.post('/send', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const db = getDB()
        const otps = db.collection('otps')

        // Generate OTP
        const otp = generateOTP()

        // Hash OTP before storing
        const otpHash = await bcrypt.hash(otp, 10)

        // Delete any existing OTP for this email
        await otps.deleteMany({ email })

        // Store OTP with 10-minute expiry
        await otps.insertOne({
            email,
            otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            createdAt: new Date()
        })

        // Send OTP via email
        await sendOTPEmail(email, otp)

        res.json({ success: true, message: 'OTP sent successfully' })
    } catch (error) {
        console.error('Send OTP error:', error)
        res.status(500).json({ success: false, message: 'Failed to send OTP' })
    }
})

// POST /api/otp/verify - Verify OTP
router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' })
        }

        const db = getDB()
        const otps = db.collection('otps')

        // Find OTP record
        const otpRecord = await otps.findOne({ email })

        if (!otpRecord) {
            return res.json({ success: false, verified: false, message: 'OTP not found or expired' })
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await otps.deleteOne({ email })
            return res.json({ success: false, verified: false, message: 'OTP expired' })
        }

        // Verify OTP
        const isValid = await bcrypt.compare(otp, otpRecord.otpHash)

        if (!isValid) {
            return res.json({ success: false, verified: false, message: 'Invalid OTP' })
        }

        // Delete OTP after successful verification
        await otps.deleteOne({ email })

        res.json({ success: true, verified: true, message: 'OTP verified successfully' })
    } catch (error) {
        console.error('Verify OTP error:', error)
        res.status(500).json({ success: false, message: 'Failed to verify OTP' })
    }
})

export default router
