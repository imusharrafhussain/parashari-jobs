import rateLimit from 'express-rate-limit'
import logger from '../utils/logger.js'

// Helper for structured logging
const logRateLimit = (req, limitType) => {
    console.warn(JSON.stringify({
        level: "warn",
        event: "rate_limit_exceeded",
        type: limitType,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    }))
}

const rateLimitHandler = (req, res) => {
    logRateLimit(req, "otp_limit_exceeded")
    res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
    })
}

// IP-based rate limiter for OTP send
// 5 requests per 10 minutes per IP
export const otpSendLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
})

// IP-based rate limiter for OTP verify
// 10 requests per 10 minutes per IP
export const otpVerifyLimiterIP = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
})

// Email-based rate limiter for OTP verify
// 5 attempts per 10 minutes per email
export const otpVerifyLimiterEmail = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    keyGenerator: (req) => {
        // Use email from request body as the key
        return req.body.email || 'unknown_user'
    },
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
})


// IP-based rate limiter for application submission
// 6 requests per hour per IP
export const applicationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 6,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
})

// Global burst limiter for all application submissions
// 100 submissions per 15 minutes globally
export const globalSubmissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Server is busy. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: () => 'global_submission_key', // same key for everyone
    handler: (req, res) => {
        console.warn(JSON.stringify({
            level: "warn",
            event: "rate_limit_exceeded",
            type: "global_submission",
            timestamp: new Date().toISOString()
        }))
        res.status(429).json({
            success: false,
            message: 'Too many submissions. Please try again later.'
        })
    }
})
