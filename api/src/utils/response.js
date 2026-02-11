/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 * 
 * Success format:
 * { success: true, message: "...", data: {...}, timestamp: "..." }
 * 
 * Error format:
 * { success: false, message: "...", errors: [...], timestamp: "..." }
 */

/**
 * Send a success response
 * @param {Response} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Send an error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array} errors - Array of validation errors (optional)
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
};

/**
 * Send a created response (201)
 * @param {Response} res - Express response object
 * @param {any} data - Created resource data
 * @param {string} message - Success message
 */
const createdResponse = (res, data, message = 'Created successfully') => {
    return successResponse(res, data, message, 201);
};

/**
 * Send a no content response (204)
 * @param {Response} res - Express response object
 */
const noContentResponse = (res) => {
    return res.status(204).send();
};

module.exports = {
    successResponse,
    errorResponse,
    createdResponse,
    noContentResponse
};
