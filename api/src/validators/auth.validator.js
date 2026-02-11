/**
 * Authentication Validators
 * Joi schemas for login and register endpoints
 */
const Joi = require('joi');

/**
 * Login request schema
 */
const { ROLES } = require('../utils/constants');

/**
 * Login request schema
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

/**
 * Register request schema
 */
const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    role: Joi.string()
        .valid(ROLES.AUTHOR, ROLES.SOLVER)
        .required()
        .messages({
            'any.only': 'Role must be AUTHOR or SOLVER',
            'any.required': 'Role is required'
        })
});

module.exports = {
    loginSchema,
    registerSchema
};
