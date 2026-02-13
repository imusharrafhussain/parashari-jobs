import { processApplication } from '../services/applicationService.js'
import logger from '../utils/logger.js'
import AppError from '../utils/AppError.js'
import { validationResult } from 'express-validator'

/**
 * Handle application submission
 * @route POST /api/applications/submit
 */
export const submitApplication = async (req, res, next) => {
    try {
        // 1. Log Request
        logger.info(JSON.stringify({
            level: "info",
            event: "application_received",
            ip: req.ip,
            email: req.body.email,
            jobCategory: req.body.jobCategory,
            timestamp: new Date().toISOString()
        }))

        // 2. Start Application Processing
        // Note: Validation is done here for minimal checks, but primary logic is in Service

        const { fullName, email, phone, city, state, linkedin, collegeName, currentCompany, description, jobCategory, customJobRole } = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({ success: false, message: 'Resume file is required' })
        }

        if (!fullName || !email || !phone || !city || !state || !collegeName || !jobCategory) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        if (jobCategory === 'Custom' && (!customJobRole || !customJobRole.trim())) {
            return res.status(400).json({ success: false, message: 'Custom job role is required' })
        }

        // 3. Delegate to Service Layer
        const result = await processApplication({
            fullName, email, phone, city, state, linkedin,
            collegeName, currentCompany, description,
            jobCategory, customJobRole,
            file
        })

        // 4. Return Success Response
        return res.status(200).json({
            success: true,
            message: "Application submitted successfully.",
            ...result
        })

    } catch (error) {
        // 5. Handle Errors (Including Email Failures)

        // Specific user-facing errors
        if (error.message.includes('Submission limit reached')) {
            return res.status(400).json({ success: false, message: error.message })
        }

        // Critical System Errors (Email failed, DB failed, etc.)
        logger.error(JSON.stringify({
            level: "error",
            event: "application_failed",
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }))

        // Architect Requirement: Return 500 if email fails
        return next(new AppError(error.message || 'Application submission failed', 500))
    }
}
