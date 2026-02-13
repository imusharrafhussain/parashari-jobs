import express from 'express'
import { upload } from '../middleware/upload.js'
import { submitApplication } from '../controllers/applicationController.js'
import { applicationLimiter, globalSubmissionLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

// POST /api/applications/submit - Submit application with strict ATS filtering
router.post('/submit', globalSubmissionLimiter, applicationLimiter, upload.single('resume'), submitApplication)

export default router
