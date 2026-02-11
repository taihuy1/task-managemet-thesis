/**
 * Services Index
 */
const authService = require('./auth.service');
const taskService = require('./task.service');
const notificationService = require('./notification.service');
const userService = require('./user.service');

module.exports = {
    authService,
    taskService,
    notificationService,
    userService
};
