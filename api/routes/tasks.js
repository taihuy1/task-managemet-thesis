const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/db');
const { sendError, validateRequired } = require('../utils/errors');
const { isValidTransition } = require('../utils/taskStatus');
const { sql } = require('../db');

const router = express.Router();

// Returns tasks filtered by user role
// Authors see tasks they created, solvers see tasks assigned to them
router.get('/', authenticateToken, requireDatabase, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        if (userRole === 'author') {
            query = 'SELECT * FROM Tasks WHERE AuthorID = @userId ORDER BY CreatedAt DESC';
        } else {
            query = 'SELECT * FROM Tasks WHERE SolverID = @userId ORDER BY CreatedAt DESC';
        }

        const result = await db.request()
            .input('userId', sql.Int, userId)
            .query(query);

        res.json(result.recordset);

    } catch (error) {
        console.error('Get tasks error:', error);
        sendError(res, 500, 'Failed to retrieve tasks', error.message);
    }
});

// Returns single task by ID
// Access control: users can only view their own tasks (enforced by GET /)
router.get('/:id', authenticateToken, requireDatabase, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        if (isNaN(taskId)) {
            return sendError(res, 400, 'Invalid task ID');
        }

        const db = req.app.locals.db;

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (result.recordset.length === 0) {
            return sendError(res, 404, 'Task not found');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Get task error:', error);
        sendError(res, 500, 'Failed to retrieve task', error.message);
    }
});

// Creates new task and assigns to solver
// Triggers notification to assigned solver
router.post('/', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['title', 'desc', 'solvers']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { title, desc, solvers } = req.body;

        if (!Array.isArray(solvers) || solvers.length === 0) {
            return sendError(res, 400, 'Task must be assigned to at least one solver');
        }

        const db = req.app.locals.db;
        const solverId = solvers[0];

        // Verify solver exists and has correct role
        const solverCheck = await db.request()
            .input('solverId', sql.Int, solverId)
            .query('SELECT UserID FROM Users WHERE UserID = @solverId AND UserRole = \'solver\'');

        if (solverCheck.recordset.length === 0) {
            return sendError(res, 400, 'Invalid solver ID');
        }

        // Create task with 'waiting' status (default state)
        const result = await db.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, desc)
            .input('authorId', sql.Int, req.user.id)
            .input('solverId', sql.Int, solverId)
            .query(`INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus) 
                    OUTPUT INSERTED.* 
                    VALUES (@title, @description, @authorId, @solverId, 'waiting')`);

        const newTask = result.recordset[0];

        // Notify solver of assignment
        await db.request()
            .input('userId', sql.Int, solverId)
            .input('taskId', sql.Int, newTask.TaskID)
            .input('message', sql.NVarChar, `You have been assigned a new task: ${title}`)
            .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');

        res.status(201).json(newTask);

    } catch (error) {
        console.error('Create task error:', error);
        sendError(res, 500, 'Failed to create task', error.message);
    }
});

// Updates task fields (title, description, status, solver)
// Status transitions validated against business rules
router.put('/:id', authenticateToken, requireDatabase, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        if (isNaN(taskId)) {
            return sendError(res, 400, 'Invalid task ID');
        }

        const db = req.app.locals.db;
        const { title, desc, status, solverId } = req.body;

        // Verify task exists and user has permission
        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found');
        }

        const task = checkResult.recordset[0];

        // Validate status transition if status is being changed
        if (status && status !== task.TaskStatus) {
            if (!isValidTransition(task.TaskStatus, status)) {
                return sendError(res, 400, 
                    `Invalid status transition from "${task.TaskStatus}" to "${status}"`
                );
            }
        }

        // Build dynamic update query
        const updates = [];
        const request = db.request().input('taskId', sql.Int, taskId);

        if (title) {
            updates.push('Title = @title');
            request.input('title', sql.NVarChar, title);
        }
        if (desc) {
            updates.push('Description = @description');
            request.input('description', sql.NVarChar, desc);
        }
        if (status) {
            updates.push('TaskStatus = @status');
            request.input('status', sql.NVarChar, status);
        }
        if (solverId) {
            updates.push('SolverID = @solverId');
            request.input('solverId', sql.Int, solverId);
        }

        if (updates.length === 0) {
            return sendError(res, 400, 'No fields to update');
        }

        const query = `UPDATE Tasks SET ${updates.join(', ')} 
                       OUTPUT INSERTED.* 
                       WHERE TaskID = @taskId`;

        const result = await request.query(query);
        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Update task error:', error);
        sendError(res, 500, 'Failed to update task', error.message);
    }
});

// Deletes task and associated notifications
// Only task author can delete (authorization enforced by middleware)
router.delete('/:id', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        if (isNaN(taskId)) {
            return sendError(res, 400, 'Invalid task ID');
        }

        const db = req.app.locals.db;

        // Verify task exists and belongs to requesting author
        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found or access denied');
        }

        // Delete notifications first (foreign key constraint)
        await db.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM Notifications WHERE TaskID = @taskId');

        // Delete task
        await db.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM Tasks WHERE TaskID = @taskId');

        res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error('Delete task error:', error);
        sendError(res, 500, 'Failed to delete task', error.message);
    }
});

module.exports = router;
