/**
 * Winston Logger Configuration
 * Professional logging with levels, timestamps, and file rotation
 */
const winston = require('winston');
const path = require('path');

const { NODE_ENV } = require('../config/app.config');

// Log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        if (stack) {
            log += `\n${stack}`;
        }
        return log;
    })
);

// Create logger
const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Console transport (always enabled)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    ]
});

// Add file transports in production
if (NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));

    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }));
}

// Helper methods for structured logging
logger.logRequest = (req) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userId: req.user?.id || 'anonymous'
    });
};

logger.logError = (error, context = {}) => {
    logger.error(error.message, {
        ...context,
        stack: error.stack
    });
};

module.exports = logger;
