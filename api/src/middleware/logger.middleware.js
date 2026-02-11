/**
 * Request Logger Middleware
 * Logs incoming requests with structured data
 */
const logger = require('../utils/logger');

/**
 * Log all incoming requests
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log request
    logger.info(`→ ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
    });

    // Log response after completion
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

        logger[logLevel](`← ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`, {
            statusCode: res.statusCode,
            duration,
            userId: req.user?.id || 'anonymous'
        });
    });

    next();
};

/**
 * Simple request logger for development (console)
 */
const devLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = {
    requestLogger,
    devLogger
};
