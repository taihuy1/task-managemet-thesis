/**
 * Routes Index
 * Aggregates all route modules
 */
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const notificationRoutes = require('./notification.routes');
const userRoutes = require('./user.routes');

module.exports = {
    authRoutes,
    taskRoutes,
    notificationRoutes,
    userRoutes
};
