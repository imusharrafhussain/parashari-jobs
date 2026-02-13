import { checkCandidateDuplicate } from '../services/candidateService.js'
import logger from '../utils/logger.js'

/**
 * Check if a candidate has already applied
 * @route POST /api/candidates/check-duplicate
 */
export const checkDuplicate = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const result = await checkCandidateDuplicate(email)

        return res.status(200).json(result)

    } catch (error) {
        logger.error(`Error checking duplicate for ${req.body.email}: ${error.message}`)

        // Don't leak internal errors to client for this endpoint
        return res.status(500).json({
            success: false,
            message: 'Unable to verify email availability'
        })
    }
}
