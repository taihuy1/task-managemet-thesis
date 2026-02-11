/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth.config');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Authentication token required', 401);
        }

        const token = authHeader.substring(7); // Remove "Bearer "

        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token expired. Please login again', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, 'Invalid token', 401);
        }
        logger.error('Authentication error:', error);
        return errorResponse(res, 'Authentication failed', 401);
    }
};

/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware
 */
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            logger.warn(`Access denied for user ${req.user?.id} (role: ${userRole})`, {
                requiredRoles: allowedRoles,
                path: req.path
            });
            return errorResponse(
                res,
                `Access denied. Required role: ${allowedRoles.join(' or ')}`,
                403
            );
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
