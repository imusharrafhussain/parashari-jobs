import 'dotenv/config' // Load env vars before anything else
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/database.js'
import { verifyEmailConnection } from './services/emailService.js'
import candidateRoutes from './routes/candidates.js'
import applicationRoutes from './routes/applications.js'
import errorHandler from './middleware/errorHandler.js'
import logger from './utils/logger.js'

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy for Render/Vercel
app.set('trust proxy', 1)

// Security Middleware - Helmet
app.use(helmet({
    frameguard: { action: 'deny' },
    noSniff: true,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    contentSecurityPolicy: false  // Disable CSP for API
}))

// CORS Middleware - Strict Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'https://parashari-jobs-portal.vercel.app',
    process.env.FRONTEND_URL // Add this to support env variable
].filter(Boolean) // Remove undefined if env var is missing

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Curl, etc.)
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin) || origin?.endsWith('.vercel.app')) {
            callback(null, true)
        } else {
            logger.warn(`CORS blocked origin: ${origin}`)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body Parser with size limits (protection against memory abuse)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))

// Routes
app.use('/api/candidates', candidateRoutes)
app.use('/api/applications', applicationRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    })
})

// Global Error Handler (must be last)
app.use(errorHandler)

// Start server
async function startServer() {
    try {
        logger.info("🚀 Starting server initialization...")
        logger.info(`PORT: ${PORT}`)
        logger.info(`NODE_ENV: ${process.env.NODE_ENV}`)

        // 1. Verify Database Connection
        logger.info("STEP 1: Connecting to Database...")
        await connectDB()

        // 2. Verify Email Connection (Critical for this app)
        logger.info("STEP 2: Verifying Email Service...")
        await verifyEmailConnection()

        // 3. Start Listening
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`✅ Server fully ready and listening on port ${PORT}`)
        })

    } catch (error) {
        logger.error("❌ FATAL STARTUP ERROR:", error)
        process.exit(1) // Fail fast
    }
}

console.log("Process starting...")
startServer()

