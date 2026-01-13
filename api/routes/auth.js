const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/db');
const { sendError, validateRequired } = require('../utils/errors');
const { sql } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Login endpoint - validates credentials and issues JWT
// JWT contains user ID and role for authorization checks
router.post('/login', requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['username', 'password']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { username, password } = req.body;
        const db = req.app.locals.db;

        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        const user = result.recordset[0];

        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }

        if (password !== user.Password) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // JWT payload contains minimal user info needed for authorization
        const token = jwt.sign(
            { id: user.UserID, role: user.UserRole },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            accessToken: token,
            user: {
                id: user.UserID,
                username: user.Username,
                role: user.UserRole
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 500, 'Authentication failed', error.message);
    }
});

// Registration endpoint - creates new user account
// In production, password should be hashed (bcrypt) before storage
router.post('/register', requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['username', 'password', 'role']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { username, password, role } = req.body;

        if (!['author', 'solver'].includes(role)) {
            return sendError(res, 400, 'Invalid role. Must be "author" or "solver"');
        }

        const db = req.app.locals.db;

        // Check for existing username
        const existing = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT UserID FROM Users WHERE Username = @username');

        if (existing.recordset.length > 0) {
            return sendError(res, 409, 'Username already exists');
        }

        await db.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('role', sql.NVarChar, role)
            .query('INSERT INTO Users (Username, Password, UserRole) VALUES (@username, @password, @role)');

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Register error:', error);
        sendError(res, 500, 'Registration failed', error.message);
    }
});

// Logout endpoint - client-side token removal
// Server-side token invalidation would require token blacklist (Redis)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
