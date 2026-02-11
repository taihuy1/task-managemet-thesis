/**
 * Database Middleware
 * Ensures database connection is available
 */
const { prisma } = require('../config/database.config');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Check database connection before processing request
 */
const requireDatabase = async (req, res, next) => {
    try {
        // Simple query to check connection
        await prisma.$queryRaw`SELECT 1`;
        next();
    } catch (error) {
        logger.error('Database connection failed:', error);
        return errorResponse(res, 'Database connection unavailable', 503);
    }
};

module.exports = {
    requireDatabase
};
