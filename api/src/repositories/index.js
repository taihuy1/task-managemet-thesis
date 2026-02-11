/**
 * Repositories Index
 */
const userRepository = require('./user.repository');
const taskRepository = require('./task.repository');
const notificationRepository = require('./notification.repository');

module.exports = {
    userRepository,
    taskRepository,
    notificationRepository
};
