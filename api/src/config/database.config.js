/**
 * Database Configuration
 * Centralized Prisma client with connection settings
 */
const { prisma } = require('../lib/prisma');

module.exports = {
    prisma,

    // Connection pool settings (for reference)
    poolSettings: {
        connectionLimit: process.env.DB_POOL_SIZE || 10,
        connectionTimeout: 10000
    }
};
