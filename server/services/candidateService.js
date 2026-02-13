import { getDB } from '../config/database.js'
import logger from '../utils/logger.js'

/**
 * Check if a candidate has reached the submission limit
 * @param {string} email - Candidate email
 * @returns {Promise<Object>} - Status object
 */
export const checkCandidateDuplicate = async (email) => {
    const db = getDB()
    const candidates = db.collection('candidates')

    // Hard limit: 6 submissions allowed
    const limit = 6

    const count = await candidates.countDocuments({ email })
    const canSubmit = count < limit
    const remaining = Math.max(0, limit - count)

    logger.info(`Duplicate check for ${email}: ${count}/${limit}`)

    return {
        success: true,
        canSubmit,
        count,
        limit,
        remaining
    }
}
