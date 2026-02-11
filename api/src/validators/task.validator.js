/**
 * Task Validators
 * Joi schemas for task CRUD operations
 */
const Joi = require('joi');
const { TASK_STATUS } = require('../utils/constants');

/**
 * Create task schema
 * Thesis requirement: Authors create tasks with title, description, and solver assignment
 */
const createTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),

    desc: Joi.string()
        .max(500)
        .optional()
        .allow('', null)
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    solvers: Joi.array()
        .items(Joi.string().uuid())
        .min(1)
        .required()
        .messages({
            'array.min': 'Task must be assigned to at least one solver',
            'string.guid': 'Solver ID must be a valid UUID',
            'any.required': 'Solvers array is required'
        })
});

/**
 * Update task schema
 * All fields optional, but must be valid if provided
 */
const updateTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .optional(),

    desc: Joi.string()
        .max(500)
        .optional()
        .allow('', null),

    status: Joi.string()
        .valid(...Object.values(TASK_STATUS))
        .optional()
        .messages({
            'any.only': `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`
        }),

    solverId: Joi.string()
        .uuid()
        .optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

/**
 * Task ID parameter schema
 */
const taskIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Task ID must be a valid UUID',
            'any.required': 'Task ID is required'
        })
});

/**
 * Reject task schema (optional reason)
 */
const rejectTaskSchema = Joi.object({
    reason: Joi.string()
        .max(300)
        .optional()
        .messages({
            'string.max': 'Rejection reason cannot exceed 300 characters'
        })
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    rejectTaskSchema
};
