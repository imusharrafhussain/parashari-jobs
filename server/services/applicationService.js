import { getDB } from '../config/database.js'
import { parseResume } from './resumeParser.js'
import { calculateATSScore } from './atsScoring.js'
import { sendHRNotification } from './emailService.js'
import logger from '../utils/logger.js'

/**
 * Handle application submission business logic
 * @param {Object} data - Candidate data and file buffer
 * @returns {Promise<Object>} - Result of the operation
 */
export const processApplication = async ({
    fullName, email, phone, city, state, linkedin, collegeName,
    currentCompany, description, jobCategory, customJobRole,
    file
}) => {
    const db = getDB()
    const candidates = db.collection('candidates')

    // 1. Check Submission Limit (Max 6)
    const submissionCount = await candidates.countDocuments({ email })
    if (submissionCount >= 6) {
        throw new Error('Submission limit reached (6/6). Please try with a different email.')
    }

    // 2. Parse Resume
    let resumeText = ''
    let parsedData = { skills: [], education: '', experience: '' }

    try {
        const result = await parseResume(file.buffer, file.mimetype)
        resumeText = result.text
        parsedData = result.parsedData
    } catch (parseError) {
        logger.warn(`Resume parsing warning for ${email}: ${parseError.message}`)
        // Continue with empty parsed data
    }

    // 3. Calculate ATS Score
    const cleanCategory = jobCategory ? String(jobCategory).trim() : ''
    const normalizedCategory = cleanCategory.toLowerCase()

    // Check if category is Other or Custom
    const isCustomCategory = ['other', 'custom', 'custom (user-defined role)'].includes(normalizedCategory) || normalizedCategory.startsWith('custom')

    let atsScore = 0
    let atsStatus = 'COMPLETED'

    if (isCustomCategory) {
        atsScore = 75 // Default passing score for custom roles
        atsStatus = 'SKIPPED'
    } else {
        atsScore = calculateATSScore(parsedData, resumeText, jobCategory)
    }

    // 4. Determine Status
    const isQualified = atsScore >= 60
    const status = isQualified ? 'qualified' : 'rejected'

    const candidateData = {
        fullName, email, phone, city, state, linkedin,
        currentCompany, collegeName, description,
        jobCategory, customJobRole,
        parsedData,
        atsScore, atsStatus,
        status,
        resumeFileName: file.originalname,
        emailSentToHR: false, // Default to false
        createdAt: new Date(),
        updatedAt: new Date()
    }

    // 5. Save to Database FIRST
    const result = await candidates.insertOne(candidateData)
    const applicationId = result.insertedId.toString().substring(0, 8).toUpperCase()

    // 6. If Qualified, Send Email (CRITICAL STEP)
    if (isQualified) {
        try {
            await sendHRNotification(candidateData, file.buffer)

            // Update DB to reflect email success
            await candidates.updateOne(
                { _id: result.insertedId },
                { $set: { emailSentToHR: true } }
            )

            logger.info(`Application ${applicationId} processed. Email sent.`)
        } catch (emailError) {
            // CRITICAL: Email failed. Propagate error to controller via Throw? 
            // Architect requirement: "If email fails -> Service THROWS error"

            logger.error(`CRITICAL: Email failed for application ${applicationId}`, emailError)

            // Optionally update DB to mark email failure reason
            await candidates.updateOne(
                { _id: result.insertedId },
                { $set: { emailError: emailError.message } }
            )

            throw new Error(`Application saved but email failed: ${emailError.message}`)
        }
    }

    return {
        applicationId,
        atsScore,
        atsStatus,
        result: isQualified ? 'QUALIFIED' : 'REJECTED_BY_ATS'
    }
}
