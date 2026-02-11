import { MongoClient, GridFSBucket } from 'mongodb'

let db = null
let gridFSBucket = null

export async function connectDB() {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        })
        db = client.db()
        gridFSBucket = new GridFSBucket(db, {
            bucketName: 'resumes'
        })

        // Create indexes
        await db.collection('candidates').createIndex({ email: 1 })
        await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

        console.log('✅ Connected to MongoDB')
        return client
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized')
    }
    return db
}

export function getGridFSBucket() {
    if (!gridFSBucket) {
        throw new Error('GridFS not initialized')
    }
    return gridFSBucket
}
