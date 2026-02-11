/**
 * Notification Service
 * Business logic for notification management
 */
const notificationRepository = require('../repositories/notification.repository');
const { NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get notifications for a user
 * @param {number} userId - User ID
 * @param {boolean} unreadOnly - Filter for unread only
 * @returns {Promise<Notification[]>} List of notifications
 */
const getNotifications = async (userId, unreadOnly = false) => {
    return notificationRepository.findByUserId(userId, unreadOnly);
};

/**
 * Get unread count for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Unread notification count
 */
const getUnreadCount = async (userId) => {
    return notificationRepository.countUnread(userId);
};

/**
 * Mark a notification as read
 * @param {number} notifId - Notification ID
 * @param {number} userId - User ID (for ownership verification)
 * @throws {NotFoundError} If notification not found or not owned by user
 */
const markAsRead = async (notifId, userId) => {
    const notification = await notificationRepository.findByIdAndUser(notifId, userId);
    if (!notification) {
        throw new NotFoundError('Notification not found or access denied');
    }

    await notificationRepository.markAsRead(notifId);

    logger.info(`Notification marked as read: ${notifId}`, { userId });
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 */
const markAllAsRead = async (userId) => {
    await notificationRepository.markAllAsRead(userId);

    logger.info('All notifications marked as read', { userId });
};

/**
 * Create a notification
 * @param {number} userId - User ID to notify
 * @param {number} taskId - Related task ID
 * @param {string} message - Notification message
 */
const createNotification = async (userId, taskId, message) => {
    const notification = await notificationRepository.create({
        userId,
        taskId,
        message
    });

    logger.info(`Notification created for user ${userId}`, { notificationId: notification.id, taskId });

    return notification;
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification
};
