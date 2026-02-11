const express = require('express');
const cors = require('cors');
const {
    PORT,
    CORS_ORIGIN,
    NODE_ENV,
    prisma
} = require('./src/config');
const {
    authRoutes,
    userRoutes,
    taskRoutes,
    notificationRoutes
} = require('./src/routes');
const {
    requestLogger,
    errorHandler,
    notFoundHandler
} = require('./src/middleware');
const logger = require('./src/utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: NODE_ENV
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

// API Routes
const API_PREFIX = '/api/v1'; // Future proofing, currently mapping directly to match existing frontend

// Mapping to match existing frontend expectations (no /api/v1 prefix yet)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/task', taskRoutes);
app.use('/notifications', notificationRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Server Start
const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected via Prisma');

        const server = app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${NODE_ENV}`);
            logger.info(`CORS origin: ${CORS_ORIGIN}`);
        });

        // Handle server errors (e.g. port in use)
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use`);
            } else {
                logger.error('Server error:', error);
            }
            process.exit(1);
        });

        // Graceful Shutdown
        const shutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully`);
            server.close(async () => {
                logger.info('HTTP server closed');
                await prisma.$disconnect();
                logger.info('Prisma disconnected');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
