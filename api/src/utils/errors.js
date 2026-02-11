/**
 * Custom Error Classes
 * Enables specific error handling with appropriate HTTP status codes
 */

/**
 * Base Application Error
 * All custom errors extend this class
 */
class AppError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true; // Distinguishes from programming errors

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Authentication Error (401)
 * Used for invalid credentials, expired tokens, missing auth
 */
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

/**
 * Authorization Error (403)
 * Used when user lacks permission for an action
 */
class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

/**
 * Not Found Error (404)
 * Used when resource doesn't exist
 */
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Validation Error (422)
 * Used for invalid input with detailed field errors
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 422, errors);
        this.name = 'ValidationError';
    }
}

/**
 * Conflict Error (409)
 * Used for state conflicts (e.g., duplicate entries, invalid state transitions)
 */
class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Bad Request Error (400)
 * Used for malformed requests
 */
class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

module.exports = {
    AppError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ConflictError,
    BadRequestError
};
