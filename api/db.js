require('dotenv').config();
const sql = require('mssql');

// Database configuration from environment variables
// Uses defaults for local development, requires explicit values in production
const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '',
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'TaskManagerDB',
    options: {
        encrypt: true,
        // trustServerCertificate allows self-signed certificates (development only)
        // In production, use proper SSL certificates
        trustServerCertificate: process.env.NODE_ENV !== 'production',
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Establishes connection pool for database operations
// Connection pooling reuses connections, improving performance under load
async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log(`Database connected: ${config.server}/${config.database}`);
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Re-throw to allow caller to handle (e.g., exit process)
        throw error;
    }
}

module.exports = { connectDB, sql };
