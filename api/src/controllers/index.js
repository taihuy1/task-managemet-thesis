/**
 * Controllers Index
 */
const authController = require('./auth.controller');
const taskController = require('./task.controller');
const notificationController = require('./notification.controller');
const userController = require('./user.controller');

module.exports = {
    authController,
    taskController,
    notificationController,
    userController
};
