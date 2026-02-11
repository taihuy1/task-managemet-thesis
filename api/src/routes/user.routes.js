/**
 * User Routes
 * User management endpoints
 */
const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');
const { authenticateToken, requireDatabase, validateParams } = require('../middleware');
const { idSchema } = require('../validators');

// GET /users - Get all solvers (for task assignment)
router.get('/',
    authenticateToken,
    requireDatabase,
    userController.getSolvers
);

// GET /users/:id - Get user by ID
router.get('/:id',
    authenticateToken,
    requireDatabase,
    validateParams(idSchema),
    userController.getUserById
);

module.exports = router;
