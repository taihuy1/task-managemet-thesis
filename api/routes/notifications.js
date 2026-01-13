const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/db');
const { sendError } = require('../utils/errors');
const { sql } = require('../db');

const router = express.Router();

// Returns all notifications for authenticated user
// Ordered by creation date (newest first)
router.get('/', authenticateToken, requireDatabase, async (req, res) => {
    try {
        const db = req.app.locals.db;

        const result = await db.request()
            .input('userId', sql.Int, req.user.id)
            .query('SELECT * FROM Notifications WHERE UserID = @userId ORDER BY CreatedAt DESC');

        res.json(result.recordset);

    } catch (error) {
        console.error('Get notifications error:', error);
        sendError(res, 500, 'Failed to retrieve notifications', error.message);
    }
});

// Marks notification as read
// Prevents duplicate read operations with idempotent update
router.put('/:id/read', authenticateToken, requireDatabase, async (req, res) => {
    try {
        const notifId = parseInt(req.params.id);
        if (isNaN(notifId)) {
            return sendError(res, 400, 'Invalid notification ID');
        }

        const db = req.app.locals.db;

        // Verify notification belongs to user
        const checkResult = await db.request()
            .input('notifId', sql.Int, notifId)
            .input('userId', sql.Int, req.user.id)
            .query('SELECT NotificationID FROM Notifications WHERE NotificationID = @notifId AND UserID = @userId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Notification not found or access denied');
        }

        await db.request()
            .input('notifId', sql.Int, notifId)
            .query('UPDATE Notifications SET IsRead = 1 WHERE NotificationID = @notifId');

        res.json({ message: 'Notification marked as read' });

    } catch (error) {
        console.error('Mark notification read error:', error);
        sendError(res, 500, 'Failed to update notification', error.message);
    }
});

module.exports = router;
