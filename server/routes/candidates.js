import express from 'express'
import { getDB } from '../config/database.js'

const router = express.Router()

// POST /api/candidates/check-duplicate - Check if email has reached limit
router.post('/check-duplicate', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const db = getDB()
        const candidates = db.collection('candidates')

        // Count how many applications this email has submitted
        const count = await candidates.countDocuments({ email })

        // Allow up to 3 applications per email
        const limit = 3
        const canSubmit = count < limit

        res.json({
            success: true,
            canSubmit,
            count,
            limit,
            remaining: Math.max(0, limit - count)
        })
    } catch (error) {
        console.error('Check duplicate error:', error)
        res.status(500).json({ success: false, message: 'Failed to check duplicate' })
    }
})

export default router
