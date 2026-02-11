import multer from 'multer'

// Use memory storage instead of GridFS storage during upload
// We'll handle GridFS upload manually in the route
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false)
    }
}

// Create multer upload instance with memory storage
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter
})
