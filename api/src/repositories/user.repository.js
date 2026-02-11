/**
 * User Repository
 * Database operations for User entities
 * Isolates Prisma queries from business logic
 */
const { prisma } = require('../config/database.config');
const { ROLES } = require('../utils/constants');

/**
 * Find user by email
 * @param {string} email - Email to search
 * @returns {Promise<User|null>} User object or null
 */
const findByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

/**
 * Find user by ID
 * @param {string} id - User ID (UUID)
 * @returns {Promise<User|null>} User object or null
 */
const findById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
};

/**
 * Create new user
 * @param {Object} userData - User data (email, password, role, name)
 * @returns {Promise<User>} Created user
 */
const create = async (userData) => {
    return prisma.user.create({
        data: userData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
};

/**
 * Find all solvers (for task assignment dropdown)
 * @returns {Promise<User[]>} List of solver users
 */
const findAllSolvers = async () => {
    return prisma.user.findMany({
        where: { role: ROLES.SOLVER },
        select: {
            id: true,
            email: true,
            name: true
        },
        orderBy: { name: 'asc' }
    });
};

/**
 * Check if user exists by email
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if exists
 */
const existsByEmail = async (email) => {
    const count = await prisma.user.count({
        where: { email }
    });
    return count > 0;
};

/**
 * Update user refresh token
 * @param {string} userId - User ID (UUID)
 * @param {string} refreshToken - New refresh token
 */
const updateRefreshToken = async (userId, refreshToken) => {
    return prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });
};

module.exports = {
    findByEmail,
    findById,
    create,
    findAllSolvers,
    existsByEmail,
    updateRefreshToken
};
