// Centralized error response formatting
// Ensures consistent error structure across all endpoints
function sendError(res, statusCode, message, details = null) {
    const response = { message };
    if (details && process.env.NODE_ENV === 'development') {
        response.details = details;
    }
    return res.status(statusCode).json(response);
}

// Validates required fields in request body
// Returns early with 400 if validation fails
function validateRequired(body, fields) {
    const missing = fields.filter(field => !body[field]);
    if (missing.length > 0) {
        return {
            valid: false,
            message: `Missing required fields: ${missing.join(', ')}`
        };
    }
    return { valid: true };
}

module.exports = { sendError, validateRequired };
