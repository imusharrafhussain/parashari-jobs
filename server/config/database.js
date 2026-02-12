import { MongoClient } from 'mongodb'
import logger from '../utils/logger.js'

let db = null
let gridFSBucket = null

export async function connectDB() {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        })
        db = client.db()
        // Create and verify indexes
        await db.collection('candidates').createIndex({ email: 1 })
        await db.collection('otps').createIndex({ email: 1 })
        await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

        logger.info('✅ Connected to MongoDB')
        logger.info('✅ Database indexes created')

        return client
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized')
    }
    return db
}

