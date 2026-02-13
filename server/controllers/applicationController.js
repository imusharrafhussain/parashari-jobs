import { getDB } from '../config/database.js'
import { parseResume } from '../services/resumeParser.js'
import { calculateATSScore } from '../services/atsScoring.js'
import { sendHRNotification } from '../services/emailService.js'
import AppError from '../utils/AppError.js'
import logger from '../utils/logger.js'

export const submitApplication = async (req, res, next) => {
    try {
        // Log Request Received
        logger.info(JSON.stringify({
            level: "info",
            event: "application_received",
            ip: req.ip,
            email: req.body.email,
            jobCategory: req.body.jobCategory,
            timestamp: new Date().toISOString()
        }))

        const { fullName, email, phone, city, state, linkedin, collegeName, currentCompany, description, jobCategory, customJobRole } = req.body
        const file = req.file

        // 1. Validation
        if (!file) {
            return res.status(400).json({ success: false, message: 'Resume file is required' })
        }

        if (!fullName || !email || !phone || !city || !state || !collegeName || !jobCategory) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        if (jobCategory === 'Custom' && (!customJobRole || !customJobRole.trim())) {
            return res.status(400).json({ success: false, message: 'Custom job role is required' })
        }

        const db = getDB()
        const candidates = db.collection('candidates')

        // Check submission count for this email (allow up to 3)
        const submissionCount = await candidates.countDocuments({ email })
        if (submissionCount >= 6) {
            return res.status(400).json({
                success: false,
                message: 'Submission limit reached (6/6). Please try with a different email.'
            })
        }

        // 2. Parse Resume & Calculate Score
        let resumeText = ''
        let parsedData = { skills: [], education: '', experience: '' }

        try {
            const result = await parseResume(file.buffer, file.mimetype)
            resumeText = result.text
            parsedData = result.parsedData
        } catch (parseError) {
            logger.warn(JSON.stringify({
                level: "warn",
                event: "resume_parsing_failed",
                error: parseError.message,
                email: email
            }))
            // Continue with empty data - manual review required
        }

        // Determine category for scoring
        const cleanCategory = jobCategory ? String(jobCategory).trim() : ''
        const normalizedCategory = cleanCategory.toLowerCase()

        // Check if category is Other or Custom
        const isCustomCategory = ['other', 'custom', 'custom (user-defined role)'].includes(normalizedCategory) || normalizedCategory.startsWith('custom')

        let atsScore = 0
        let atsStatus = 'COMPLETED'

        if (isCustomCategory) {
            atsScore = 75 // Default passing score for custom roles (Manual Review implied)
            atsStatus = 'SKIPPED'
        } else {
            atsScore = calculateATSScore(parsedData, resumeText, jobCategory)
        }

        // Log ATS Score
        logger.info(JSON.stringify({
            level: "info",
            event: "ats_score_calculated",
            email: email,
            score: atsScore,
            category: jobCategory,
            timestamp: new Date().toISOString()
        }))

        // 3. Decision Logic

        if (atsScore >= 60) {
            // --- QUALIFIED (>= 60) ---

            const candidateInfo = {
                fullName,
                email,
                phone,
                city,
                state,
                linkedin,
                currentCompany,
                collegeName,
                description,
                jobCategory,
                customJobRole,
                atsScore,
                atsStatus,
                resumeFileName: file.originalname,
                parsedData // Include parsedData for email template
            }

            let emailSuccess = false

            // A. Attempt to Send Email to HR
            try {
                await sendHRNotification(candidateInfo, file.buffer)
                emailSuccess = true

                // Log Email Success
                logger.info(JSON.stringify({
                    level: "info",
                    event: "email_sent_success",
                    email: email,
                    score: atsScore,
                    timestamp: new Date().toISOString()
                }))
            } catch (emailError) {
                // Log Email Failure but CONTINUE
                logger.error(JSON.stringify({
                    level: "error",
                    event: "email_send_failed",
                    email: email,
                    error: emailError.message,
                    timestamp: new Date().toISOString()
                }))
            }

            // B. Save Metadata to MongoDB (Regardless of email status)
            const candidateData = {
                ...candidateInfo,
                parsedData,
                status: 'qualified',
                emailSentToHR: emailSuccess,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            try {
                const result = await candidates.insertOne(candidateData)
                const applicationId = result.insertedId.toString().substring(0, 8).toUpperCase()

                // C. Return Success
                return res.status(200).json({
                    success: true,
                    message: "Application submitted successfully.",
                    applicationId,
                    score: atsScore,
                    atsStatus,
                    result: 'QUALIFIED'
                })
            } catch (dbError) {
                logger.error(JSON.stringify({
                    level: "error",
                    event: "db_save_failed",
                    email: email,
                    error: dbError.message,
                    timestamp: new Date().toISOString()
                }))
                return res.status(500).json({
                    success: false,
                    message: "Failed to save application data. Please try again."
                })
            }

        } else {
            // --- REJECTED (< 60) ---

            // Log Rejection
            logger.info(JSON.stringify({
                level: "info",
                event: "candidate_rejected",
                email: email,
                score: atsScore,
                timestamp: new Date().toISOString()
            }))

            // A. Store Metadata (Status: Rejected)
            const candidateData = {
                fullName,
                email,
                phone,
                city,
                state,
                linkedin: linkedin || '',
                currentCompany: currentCompany || '',
                collegeName,
                description: description || '',
                jobCategory,
                customJobRole: jobCategory === 'Custom' ? customJobRole : undefined,
                parsedData,
                atsScore,
                atsStatus,
                status: 'rejected',
                emailSentToHR: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // We store rejected candidates for analytics/history, but no resume.
            await candidates.insertOne(candidateData)

            // B. Return Failure (200 OK with success: false)
            return res.status(200).json({
                success: false,
                message: "Application does not meet ATS criteria.",
                score: atsScore,
                atsStatus,
                result: 'REJECTED_BY_ATS'
            })
        }

    } catch (error) {
        // Log Unexpected Error
        logger.error(JSON.stringify({
            level: "error",
            event: "server_error",
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }))
        next(new AppError(error.message || 'Failed to submit application', 500))
    }
}
