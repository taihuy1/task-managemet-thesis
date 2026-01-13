const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
require('dotenv').config();

// Route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const requestRoutes = require('./routes/requests');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Environment configuration with defaults for local development
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Validate critical environment variables in production
if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_key') {
        console.error('ERROR: JWT_SECRET must be set in production environment');
        process.exit(1);
    }
}

// Middleware: Parse JSON request bodies
// Must be registered before routes that expect JSON
app.use(express.json());

// Middleware: CORS configuration
// Allows frontend (different origin) to make requests
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

// Request logging middleware
// Helps with debugging and monitoring in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Health check endpoint (no authentication required)
// Useful for deployment monitoring and load balancer health checks
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: app.locals.db ? 'connected' : 'disconnected'
    });
});

// API route registration
// Organized by domain: auth, users, tasks, requests, notifications
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/task', taskRoutes);
app.use('/request', requestRoutes);
app.use('/notifications', notificationRoutes);

// Global error handler (catches unhandled errors)
// Prevents server crash and provides consistent error response
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Database connection and server startup
// Database pool stored in app.locals for route access
connectDB()
    .then((pool) => {
        app.locals.db = pool;
        console.log('Database connection established');
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`CORS origin: ${CORS_ORIGIN}`);
        });

        // Graceful shutdown handling
        // Ensures database connections are closed properly on termination
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('HTTP server closed');
                pool.close(() => {
                    console.log('Database pool closed');
                    process.exit(0);
                });
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('HTTP server closed');
                pool.close(() => {
                    console.log('Database pool closed');
                    process.exit(0);
                });
            });
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
