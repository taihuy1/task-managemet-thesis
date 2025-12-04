const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3001;

// This variable will hold our database connection
let db;

// 1. Middleware Configuration
app.use(express.json()); // Allows us to read JSON from the frontend
app.use(cors({
    origin: 'http://localhost:3000', // Allow our React app
    credentials: true                // Allow cookies/tokens
}));

// 2. Simple request logger (Good for debugging)
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// ---------------- ROUTES ----------------

// Login Route
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        // Check if DB is ready
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        // Find the user in SQL
        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        const user = result.recordset[0];

        // Validate user and password
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // TODO: Switch to bcrypt.compare() before final submission
        if (password !== user.Password) { 
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate the token
        const accessToken = jwt.sign(
            { id: user.UserID, role: user.UserRole }, 
            'your_secret_key', 
            { expiresIn: '1h' } 
        );

        console.log(`User ${username} logged in successfully.`);

        // Send back the data
        res.json({ 
            accessToken, 
            user: { 
                id: user.UserID, 
                username: user.Username, 
                role: user.UserRole 
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send('Server Error');
    }
});

// ---------------- STARTUP ----------------

// Connect to DB first, then start the server
console.log("Initializing server...");

connectDB()
    .then((pool) => {
        db = pool; // Save the connection globally
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database.");
        console.error(err);
    });