import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { getDB, getGridFSBucket } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import AppError from '../utils/AppError.js'
import logger from '../utils/logger.js'

const router = express.Router()

// POST /api/admin/login - Admin login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            throw new AppError('Username and password are required', 400)
        }

        // Verify credentials
        const validUsername = process.env.ADMIN_USERNAME || 'admin'
        const passwordHash = process.env.ADMIN_PASSWORD_HASH

        if (!passwordHash) {
            logger.error('ADMIN_PASSWORD_HASH not configured')
            throw new AppError('Admin authentication not configured', 500)
        }

        if (username !== validUsername) {
            logger.warn(`Failed admin login attempt for username: ${username}`)
            throw new AppError('Invalid credentials', 401)
        }

        // Compare password with hash
        const isValidPassword = await bcrypt.compare(password, passwordHash)

        if (!isValidPassword) {
            logger.warn(`Failed admin login attempt - invalid password`)
            throw new AppError('Invalid credentials', 401)
        }

        // Generate JWT token
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        logger.info(`Admin logged in successfully: ${username}`)

        res.json({
            success: true,
            token,
            expiresIn: 3600 // 1 hour in seconds
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/admin/applications - Get all applications (protected)
router.get('/applications', authenticateToken, async (req, res, next) => {
    try {
        const db = getDB()
        const candidates = db.collection('candidates')

        // Get query parameters for filtering
        const { atsScore, status, limit = 50, skip = 0 } = req.query

        // Build filter
        const filter = {}
        if (atsScore) {
            filter.atsScore = { $gte: parseInt(atsScore) }
        }
        if (status) {
            filter.status = status
        }

        // Get applications
        const applications = await candidates
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .toArray()

        const total = await candidates.countDocuments(filter)

        res.json({
            success: true,
            total,
            count: applications.length,
            applications
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/admin/applications/:id - Get single application (protected)
router.get('/applications/:id', authenticateToken, async (req, res, next) => {
    try {
        const db = getDB()
        const candidates = db.collection('candidates')

        const application = await candidates.findOne({
            _id: new ObjectId(req.params.id)
        })

        if (!application) {
            throw new AppError('Application not found', 404)
        }

        res.json({
            success: true,
            application
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/admin/resumes/:fileId - Download resume (protected)
router.get('/resumes/:fileId', authenticateToken, async (req, res, next) => {
    try {
        const bucket = getGridFSBucket()
        const fileId = new ObjectId(req.params.fileId)

        // Find file metadata
        const files = await bucket.find({ _id: fileId }).toArray()

        if (!files || files.length === 0) {
            throw new AppError('Resume not found', 404)
        }

        const file = files[0]

        // Set headers
        res.set({
            'Content-Type': file.metadata.mimetype,
            'Content-Disposition': `attachment; filename="${file.metadata.originalName}"`,
            'Content-Length': file.length
        })

        // Stream file
        const downloadStream = bucket.openDownloadStream(fileId)

        downloadStream.on('error', (error) => {
            logger.error('Resume download error:', error)
            next(new AppError('Failed to download resume', 500))
        })

        downloadStream.pipe(res)
    } catch (error) {
        next(error)
    }
})

// GET /api/admin/stats - Get statistics (protected)
router.get('/stats', authenticateToken, async (req, res, next) => {
    try {
        const db = getDB()
        const candidates = db.collection('candidates')

        const [total, qualified, pending, avgScore] = await Promise.all([
            candidates.countDocuments(),
            candidates.countDocuments({ status: 'qualified' }),
            candidates.countDocuments({ status: 'pending' }),
            candidates.aggregate([
                { $match: { atsScore: { $ne: null } } },
                { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
            ]).toArray()
        ])

        res.json({
            success: true,
            stats: {
                total,
                qualified,
                pending,
                rejected: total - qualified - pending,
                averageATSScore: avgScore[0]?.avgScore?.toFixed(2) || 0
            }
        })
    } catch (error) {
        next(error)
    }
})

export default router
