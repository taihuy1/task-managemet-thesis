/**
 * Notification Routes
 * GET/PUT operations for notifications
 */
const express = require('express');
const router = express.Router();

const { notificationController } = require('../controllers');
const { authenticateToken, requireDatabase, validateParams } = require('../middleware');
const { idSchema } = require('../validators');

// GET /notifications - Get all notifications for user
router.get('/',
    authenticateToken,
    requireDatabase,
    notificationController.getNotifications
);

// GET /notifications/unread-count - Get unread count
router.get('/unread-count',
    authenticateToken,
    requireDatabase,
    notificationController.getUnreadCount
);

// PUT /notifications/:id/read - Mark as read
router.put('/:id/read',
    authenticateToken,
    requireDatabase,
    validateParams(idSchema),
    notificationController.markAsRead
);

// PUT /notifications/read-all - Mark all as read
router.put('/read-all',
    authenticateToken,
    requireDatabase,
    notificationController.markAllAsRead
);

module.exports = router;
