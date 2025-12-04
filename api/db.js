require('dotenv').config();
const sql = require('mssql');

// database config
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// connect to database
async function connectDB() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        console.log('Database connected successfully!');
        return pool;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = { connectDB, sql };