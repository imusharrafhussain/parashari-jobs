import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError.js'
import logger from '../utils/logger.js'

// JWT authentication middleware
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            throw new AppError('Authentication required', 401)
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                logger.warn('Invalid JWT token attempt')
                throw new AppError('Invalid or expired token', 403)
            }

            req.user = user
            next()
        })
    } catch (error) {
        next(error)
    }
}

// Optional: Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new AppError('Admin access required', 403))
    }
    next()
}
