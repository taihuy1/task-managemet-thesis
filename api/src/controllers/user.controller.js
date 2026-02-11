/**
 * User Controller
 * Handles HTTP requests for user endpoints
 */
const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

/**
 * GET /users
 * Get all solvers (for task assignment)
 */
const getSolvers = async (req, res, next) => {
    try {
        const solvers = await userService.getAllSolvers();

        return successResponse(res, solvers, 'Solvers retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /users/:id
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await userService.getUserById(userId);

        return successResponse(res, user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSolvers,
    getUserById
};
