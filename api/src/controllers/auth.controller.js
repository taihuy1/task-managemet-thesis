/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
const authService = require('../services/auth.service');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        return successResponse(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

/**
 * POST /auth/register
 * Register a new user
 */
const register = async (req, res, next) => {
    try {
        const { email, password, role, name } = req.body;

        const user = await authService.register(email, password, role, name);

        return createdResponse(res, user, 'User registered successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * POST /auth/logout
 * Logout user (client should delete token)
 */
const logout = async (req, res, next) => {
    try {
        // In stateless JWT, logout is handled client-side
        // Server can optionally blacklist token or update refresh token
        logger.info('User logged out', { userId: req.user?.id });

        return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    logout
};
