import AppError from '../utils/AppError.js'

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    // Log error
    console.error('ERROR:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        statusCode: err.statusCode
    })

    // Development: send full error
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }

    // Production: hide implementation details
    // Only send operational errors details
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // Programming or unknown errors: don't leak details
    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    })
}

export default errorHandler
