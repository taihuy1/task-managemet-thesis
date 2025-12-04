require('dotenv').config(); 
const sql = require('mssql');

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

async function connectDB() {
    try {
        console.log(`Connecting to ${process.env.DB_SERVER}...`);
        const pool = await sql.connect(config);
        console.log("Connected to database!");
        return pool;
    } catch (error) {
        console.error("Connection failed:", error);
        throw error;
    }
}

module.exports = { connectDB, sql };