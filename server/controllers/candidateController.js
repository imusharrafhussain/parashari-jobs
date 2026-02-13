import { getDB } from '../config/database.js'
import AppError from '../utils/AppError.js'
import logger from '../utils/logger.js'

export const checkDuplicate = async (req, res, next) => {
    try {
        const { email } = req.body

        const db = getDB()
        const candidates = db.collection('candidates')

        // Count how many applications this email has submitted
        const count = await candidates.countDocuments({ email })

        // Allow up to 3 applications per email
        const limit = 3
        const canSubmit = count < limit

        logger.info(`Duplicate check for ${email}: ${count}/${limit}`)

        res.json({
            success: true,
            canSubmit,
            count,
            limit,
            remaining: Math.max(0, limit - count)
        })
    } catch (error) {
        logger.error('Check duplicate error:', error)
        next(new AppError('Failed to check duplicate', 500))
    }
}
