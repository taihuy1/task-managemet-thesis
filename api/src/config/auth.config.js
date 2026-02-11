/**
 * Authentication Configuration
 * JWT secrets, expiry times, and security settings
 */
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 12;

// Production security check
if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_key') {
        console.error('ERROR: JWT_SECRET must be set in production environment');
        process.exit(1);
    }
}

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    SALT_ROUNDS
};
