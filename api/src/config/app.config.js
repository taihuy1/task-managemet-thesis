/**
 * Application Configuration
 * Port, CORS, rate limiting, and general app settings
 */
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3001,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Rate limiting settings
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100 // limit each IP to 100 requests per windowMs
    },

    // API versioning
    API_VERSION: 'v1',
    API_PREFIX: '/api/v1'
};
