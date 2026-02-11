/**
 * Authentication Routes
 * POST /auth/login, /auth/register, /auth/logout
 */
const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');
const { authenticateToken } = require('../middleware');
const { validateRequest } = require('../middleware');
const { loginSchema, registerSchema } = require('../validators');
const { requireDatabase } = require('../middleware');

// POST /auth/login
router.post('/login',
    requireDatabase,
    validateRequest(loginSchema),
    authController.login
);

// POST /auth/register
router.post('/register',
    requireDatabase,
    validateRequest(registerSchema),
    authController.register
);

// POST /auth/logout
router.post('/logout',
    authenticateToken,
    authController.logout
);

module.exports = router;
