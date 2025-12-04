const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3001;

let db;

// middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// login endpoint
app.post('/auth/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        // find user
        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // check password (TODO: use bcrypt later)
        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // create token
        const token = jwt.sign(
            { id: user.UserID, role: user.UserRole },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        console.log('Login successful for:', username);

        res.json({
            accessToken: token,
            user: {
                id: user.UserID,
                username: user.Username,
                role: user.UserRole
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// connect database and start server
console.log('Starting server...');

connectDB()
    .then((pool) => {
        db = pool;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });