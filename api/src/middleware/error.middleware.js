/**
 * Error Handling Middleware
 * Centralized error handling with proper status codes
 */
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Global error handler middleware
 * Catches all errors and returns standardized response
 */
const errorHandler = (err, req, res, next) => {
    // Log error
    logger.logError(err, {
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id
    });

    // Handle operational errors (our custom errors)
    if (err instanceof AppError && err.isOperational) {
        return errorResponse(res, err.message, err.statusCode, err.errors);
    }

    // Handle Prisma errors
    if (err.code === 'P2002') {
        return errorResponse(res, 'A record with this value already exists', 409);
    }

    if (err.code === 'P2025') {
        return errorResponse(res, 'Record not found', 404);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired. Please login again', 401);
    }

    // Handle unknown errors
    const isDevelopment = process.env.NODE_ENV === 'development';

    return errorResponse(
        res,
        isDevelopment ? err.message : 'Internal server error',
        500
    );
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return errorResponse(res, `Route ${req.method} ${req.path} not found`, 404);
};

module.exports = {
    errorHandler,
    notFoundHandler
};
