// Ensures database connection exists before route handlers execute
// Prevents repeated null checks across all endpoints
function requireDatabase(req, res, next) {
    if (!req.app.locals.db) {
        return res.status(503).json({ 
            message: 'Database service unavailable',
            error: 'Database connection not established'
        });
    }
    next();
}

module.exports = { requireDatabase };
