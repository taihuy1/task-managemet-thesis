/**
 * Common Validators
 * Reusable Joi schemas for shared validation logic
 */
const Joi = require('joi');

/**
 * Generic ID parameter schema (UUID)
 * Validates req.params.id
 */
const idSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'ID must be a valid UUID',
            'any.required': 'ID is required'
        })
});

module.exports = {
    idSchema
};
