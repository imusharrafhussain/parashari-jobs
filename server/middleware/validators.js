import { body, validationResult } from 'express-validator'

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        })
    }
    next()
}

// Validation for OTP send
export const validateOTPSend = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
]

// Validation for OTP verify
export const validateOTPVerify = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isNumeric().withMessage('OTP must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    handleValidationErrors
]

// Validation for application submission
export const validateApplication = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .escape()
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .isMobilePhone('any', { strictMode: false }).withMessage('Invalid phone number'),
    body('city')
        .trim()
        .notEmpty().withMessage('City is required')
        .escape(),
    body('state')
        .trim()
        .notEmpty().withMessage('State is required')
        .escape(),
    body('linkedin')
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage('Invalid LinkedIn URL'),
    body('collegeName')
        .trim()
        .notEmpty().withMessage('College name is required')
        .escape()
        .isLength({ min: 2, max: 200 }).withMessage('College name must be between 2 and 200 characters'),
    body('currentCompany')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('jobCategory')
        .trim()
        .notEmpty().withMessage('Job category is required'),
    body('customJobRole')
        .if(body('jobCategory').equals('Custom'))
        .trim()
        .notEmpty().withMessage('Custom job role is required when category is Custom')
        .escape(),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    handleValidationErrors
]

// Validation for candidate duplicate check
export const validateCandidateDuplicate = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
]
