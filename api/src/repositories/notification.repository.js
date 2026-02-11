/**
 * Notification Repository
 * Database operations for Notification entities
 */
const { prisma } = require('../config/database.config');

/**
 * Create a notification
 * @param {Object} notifData - Notification data (userId, taskId, message)
 * @returns {Promise<Notification>} Created notification
 */
const create = async (notifData) => {
    return prisma.notification.create({
        data: notifData
    });
};

/**
 * Find notifications for a user
 * @param {number} userId - User ID
 * @param {boolean} unreadOnly - Filter for unread only
 * @returns {Promise<Notification[]>} List of notifications
 */
const findByUserId = async (userId, unreadOnly = false) => {
    const whereClause = unreadOnly
        ? { userId, isRead: false }
        : { userId };

    return prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Find notification by ID and user (ownership check)
 * @param {number} notifId - Notification ID
 * @param {number} userId - User ID
 * @returns {Promise<Notification|null>} Notification if owned by user
 */
const findByIdAndUser = async (notifId, userId) => {
    return prisma.notification.findFirst({
        where: { id: notifId, userId }
    });
};

/**
 * Mark notification as read
 * @param {number} notifId - Notification ID
 * @returns {Promise<Notification>} Updated notification
 */
const markAsRead = async (notifId) => {
    return prisma.notification.update({
        where: { id: notifId },
        data: { isRead: true }
    });
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 */
const markAllAsRead = async (userId) => {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
};

/**
 * Delete all notifications for a task
 * @param {number} taskId - Task ID
 */
const deleteByTaskId = async (taskId) => {
    return prisma.notification.deleteMany({
        where: { taskId }
    });
};

/**
 * Count unread notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Unread count
 */
const countUnread = async (userId) => {
    return prisma.notification.count({
        where: { userId, isRead: false }
    });
};

module.exports = {
    create,
    findByUserId,
    findByIdAndUser,
    markAsRead,
    markAllAsRead,
    deleteByTaskId,
    countUnread
};
