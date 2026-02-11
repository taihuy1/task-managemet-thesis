/**
 * User Service
 * Business logic for user management
 */
const userRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');

/**
 * Get all solvers for task assignment dropdown
 * @returns {Promise<User[]>} List of solver users
 */
const getAllSolvers = async () => {
    return userRepository.findAllSolvers();
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<User|null>} User object or null
 */
const getUserById = async (userId) => {
    return userRepository.findById(userId);
};

module.exports = {
    getAllSolvers,
    getUserById
};
