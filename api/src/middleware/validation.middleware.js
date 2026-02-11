/**
 * Validation Middleware
 * Validates request body against Joi schemas
 */
const { errorResponse } = require('../utils/response');

/**
 * Create validation middleware for a schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just first
            stripUnknown: true // Remove unknown fields (security)
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, '') // Clean up Joi quotes
            }));

            return errorResponse(res, 'Validation failed', 422, errors);
        }

        // Replace req.body with validated and sanitized value
        req.body = value;
        next();
    };
};

/**
 * Validate request params (e.g., :id)
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, '')
            }));

            return errorResponse(res, 'Invalid parameters', 400, errors);
        }

        req.params = value;
        next();
    };
};

module.exports = {
    validateRequest,
    validateParams
};
