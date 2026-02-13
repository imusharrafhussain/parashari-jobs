import express from 'express'
import { checkDuplicate } from '../controllers/candidateController.js'
import { validateCandidateDuplicate } from '../middleware/validators.js'

const router = express.Router()

// POST /api/candidates/check-duplicate - Check if email has reached limit
router.post('/check-duplicate', validateCandidateDuplicate, checkDuplicate)

export default router

