import express from 'express'
import { ObjectId } from 'mongodb'
import { getDB, getGridFSBucket } from '../config/database.js'
import { upload } from '../middleware/upload.js'
import { parseResume } from '../services/resumeParser.js'
import { calculateATSScore } from '../services/atsScoring.js'
import { sendHRNotification } from '../services/emailService.js'
import { Readable } from 'stream'

const router = express.Router()

// POST /api/applications/submit - Submit complete application
router.post('/submit', upload.single('resume'), async (req, res) => {
    let fileId = null // Track uploaded file ID for cleanup on error

    try {
        const { fullName, email, phone, city, state, linkedin, collegeName, currentCompany, description, jobCategory, customJobRole } = req.body
        const file = req.file

        // Validate required fields
        // Validate required fields
        if (!fullName || !email || !phone || !city || !state || !collegeName || !jobCategory) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        // Validate custom job role
        if (jobCategory === 'Custom' && (!customJobRole || !customJobRole.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Custom job role is required'
            })
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required'
            })
        }

        const db = getDB()
        const candidates = db.collection('candidates')
        const bucket = getGridFSBucket()

        // Check submission count for this email (allow up to 3)
        const submissionCount = await candidates.countDocuments({ email })
        if (submissionCount >= 3) {
            return res.status(400).json({
                success: false,
                message: 'You have reached the maximum limit of 3 applications for this email address'
            })
        }

        // Get resume buffer from multer memory storage
        const resumeBuffer = file.buffer

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(file.originalname, {
            metadata: {
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                uploadDate: new Date()
            }
        })

        const bufferStream = Readable.from(resumeBuffer)
        bufferStream.pipe(uploadStream)

        // Wait for upload to complete
        fileId = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => resolve(uploadStream.id))
            uploadStream.on('error', reject)
        })

        // Parse resume
        const { text: resumeText, parsedData } = await parseResume(resumeBuffer, file.mimetype)

        // Calculate ATS score
        // Calculate ATS score based on category
        // Calculate ATS score based on category
        let atsScore = null
        let atsStatus = 'COMPLETED'

        const cleanCategory = jobCategory ? String(jobCategory).trim() : ''
        const normalizedCategory = cleanCategory.toLowerCase()
        console.log(`Processing application for category: '${cleanCategory}' (Normalized: '${normalizedCategory}')`)

        // Check if category is Other or Custom (including "custom (user-defined role)")
        const skipATS = ['other', 'custom', 'custom (user-defined role)'].includes(normalizedCategory) || normalizedCategory.startsWith('custom')

        if (skipATS) {
            console.log('Skipping ATS scoring for Other/Custom category')
            atsScore = null
            atsStatus = 'SKIPPED'
        } else {
            console.log('Running ATS scoring')
            atsScore = calculateATSScore(parsedData, resumeText, jobCategory)
        }

        // Create candidate record
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
            resumeFileId: fileId,
            resumeFileName: file.originalname,
            parsedData,
            atsScore,
            atsStatus,
            status: (atsStatus === 'SKIPPED' || (atsStatus === 'COMPLETED' && atsScore >= 70)) ? 'qualified' : 'pending',
            emailSentToHR: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        // Insert candidate
        const result = await candidates.insertOne(candidateData)
        const applicationId = result.insertedId.toString().substring(0, 8).toUpperCase()

        // If ATS score >= 70 or ATS was skipped (Other/Custom), send email to HR
        if (atsStatus === 'SKIPPED' || atsScore >= 70) {
            try {
                await sendHRNotification({ ...candidateData, _id: result.insertedId }, resumeBuffer)
                await candidates.updateOne(
                    { _id: result.insertedId },
                    { $set: { emailSentToHR: true } }
                )
                console.log(`✅ HR notified for ${fullName} (Score: ${atsScore})`)
            } catch (emailError) {
                console.error('Failed to send HR email:', emailError)
                // Don't fail the application if email fails
            }
        }

        // Determine result for frontend
        let resultType = 'RECEIVED'
        let message = 'Application received.'

        if (atsStatus === 'SKIPPED') {
            resultType = 'RECEIVED_MANUAL_REVIEW'
            message = 'Application received. Your profile will be reviewed manually.'
        } else if (atsScore < 70) {
            resultType = 'REJECTED_BY_ATS'
            message = 'Unfortunately, your profile does not meet our current requirements.'
        } else {
            resultType = 'QUALIFIED'
            message = 'Congratulations! Your profile meets our requirements.'
        }

        res.json({
            success: true,
            message,
            applicationId,
            atsScore, // Return score to frontend for messaging
            atsStatus,
            jobCategory,
            result: resultType,
            qualified: resultType === 'QUALIFIED' || resultType === 'RECEIVED_MANUAL_REVIEW'
        })

    } catch (error) {
        console.error('Application submission error:', error)

        // Clean up uploaded file if error occurs and fileId exists
        // Note: fileId will only exist if upload completed before error
        // No need to cleanup if error occurred before upload
        if (fileId) {
            try {
                const bucket = getGridFSBucket()
                await bucket.delete(new ObjectId(fileId))
            } catch (deleteError) {
                console.error('Failed to delete file after error:', deleteError)
            }
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit application'
        })
    }
})

export default router
