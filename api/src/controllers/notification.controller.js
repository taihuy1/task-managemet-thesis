/**
 * Notification Controller
 * Handles HTTP requests for notification endpoints
 */
const notificationService = require('../services/notification.service');
const taskService = require('../services/task.service');
const { successResponse } = require('../utils/response');

/**
 * GET /notifications
 * Get notifications for the authenticated user
 * Note: Current implementation returns tasks (matching existing behavior)
 */
const getNotifications = async (req, res, next) => {
    try {
        const { id: userId, role } = req.user;

        // Current behavior returns tasks, not notifications
        // This matches the existing implementation for backwards compatibility
        const tasks = await taskService.getTasksByRole(userId, role);

        return successResponse(res, tasks, 'Notifications retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /notifications/:id/read
 * Mark a notification as read
 */
const markAsRead = async (req, res, next) => {
    try {
        const notifId = req.params.id;
        const userId = req.user.id;

        await notificationService.markAsRead(notifId, userId);

        return successResponse(res, null, 'Notification marked as read');
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /notifications/read-all
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await notificationService.markAllAsRead(userId);

        return successResponse(res, null, 'All notifications marked as read');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /notifications/unread-count
 * Get count of unread notifications
 */
const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const count = await notificationService.getUnreadCount(userId);

        return successResponse(res, { count }, 'Unread count retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};
