/**
 * Middleware Index
 */
const { authenticateToken, authorizeRole } = require('./auth.middleware');
const { requireDatabase } = require('./db.middleware');
const { errorHandler, notFoundHandler } = require('./error.middleware');
const { requestLogger, devLogger } = require('./logger.middleware');
const { validateRequest, validateParams } = require('./validation.middleware');

module.exports = {
    authenticateToken,
    authorizeRole,
    requireDatabase,
    errorHandler,
    notFoundHandler,
    requestLogger,
    devLogger,
    validateRequest,
    validateParams
};
