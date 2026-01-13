const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/db');
const { sendError } = require('../utils/errors');
const { sql } = require('../db');

const router = express.Router();

// Returns list of all solver users
// Only accessible to authors for task assignment
router.get('/solvers', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const db = req.app.locals.db;

        const result = await db.request()
            .query('SELECT UserID, Username, FullName FROM Users WHERE UserRole = \'solver\' ORDER BY FullName');

        res.json(result.recordset);

    } catch (error) {
        console.error('Get solvers error:', error);
        sendError(res, 500, 'Failed to retrieve solvers', error.message);
    }
});

module.exports = router;
