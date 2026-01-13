const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/db');
const { sendError, validateRequired } = require('../utils/errors');
const { isValidTransition } = require('../utils/taskStatus');
const { sql } = require('../db');

const router = express.Router();

// Assigns existing task to solver
// Alternative to creating task with assignment in one step
router.post('/send', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['taskId', 'solvers']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { taskId, solvers } = req.body;

        if (!Array.isArray(solvers) || solvers.length === 0) {
            return sendError(res, 400, 'Solvers must be a non-empty array');
        }

        const db = req.app.locals.db;

        const taskResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (taskResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found');
        }

        const task = taskResult.recordset[0];
        const solverId = solvers[0];

        await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, solverId)
            .query('UPDATE Tasks SET SolverID = @solverId, TaskStatus = \'waiting\' WHERE TaskID = @taskId');

        await db.request()
            .input('userId', sql.Int, solverId)
            .input('taskId', sql.Int, taskId)
            .input('message', sql.NVarChar, `You have been assigned a new task: ${task.Title}`)
            .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');

        res.json({ message: 'Task assigned successfully' });

    } catch (error) {
        console.error('Send task error:', error);
        sendError(res, 500, 'Failed to assign task', error.message);
    }
});

// Solver starts working on task
// Transitions status: waiting → started
router.post('/rely/start', authenticateToken, authorizeRole('solver'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['taskId']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { taskId } = req.body;
        const db = req.app.locals.db;

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND SolverID = @solverId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found or not assigned to you');
        }

        const task = checkResult.recordset[0];

        if (!isValidTransition(task.TaskStatus, 'started')) {
            return sendError(res, 400, 
                `Cannot start task. Current status: "${task.TaskStatus}". Expected: "waiting"`
            );
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'started\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        // Notify author that solver has started
        if (task.AuthorID) {
            await db.request()
                .input('userId', sql.Int, task.AuthorID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, `Task "${task.Title}" has been started by the solver`)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Start task error:', error);
        sendError(res, 500, 'Failed to start task', error.message);
    }
});

// Solver marks task as completed
// Transitions status: started → completed
router.post('/rely/complete', authenticateToken, authorizeRole('solver'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['taskId']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { taskId } = req.body;
        const db = req.app.locals.db;

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND SolverID = @solverId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found or not assigned to you');
        }

        const task = checkResult.recordset[0];

        if (!isValidTransition(task.TaskStatus, 'completed')) {
            return sendError(res, 400, 
                `Cannot complete task. Current status: "${task.TaskStatus}". Expected: "started"`
            );
        }

        const updateResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'completed\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        // Notify author that task is ready for review
        if (task.AuthorID) {
            await db.request()
                .input('userId', sql.Int, task.AuthorID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, `Task "${task.Title}" has been completed by the solver`)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(updateResult.recordset[0]);

    } catch (error) {
        console.error('Complete task error:', error);
        sendError(res, 500, 'Failed to complete task', error.message);
    }
});

// Author approves completed task
// Transitions status: completed → approved
router.post('/rely/approved', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['taskId']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { taskId } = req.body;
        const db = req.app.locals.db;

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found or access denied');
        }

        const task = checkResult.recordset[0];

        if (!isValidTransition(task.TaskStatus, 'approved')) {
            return sendError(res, 400, 
                `Cannot approve task. Current status: "${task.TaskStatus}". Expected: "completed"`
            );
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'approved\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        // Notify solver of approval
        if (task.SolverID) {
            await db.request()
                .input('userId', sql.Int, task.SolverID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, 'Your task has been approved')
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Approve task error:', error);
        sendError(res, 500, 'Failed to approve task', error.message);
    }
});

// Author rejects completed task
// Transitions status: completed → rejected
// Optional rejection reason stored for feedback
router.post('/rely/rejected', authenticateToken, authorizeRole('author'), requireDatabase, async (req, res) => {
    try {
        const validation = validateRequired(req.body, ['taskId']);
        if (!validation.valid) {
            return sendError(res, 400, validation.message);
        }

        const { taskId, reason } = req.body;
        const db = req.app.locals.db;

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return sendError(res, 404, 'Task not found or access denied');
        }

        const task = checkResult.recordset[0];

        if (!isValidTransition(task.TaskStatus, 'rejected')) {
            return sendError(res, 400, 
                `Cannot reject task. Current status: "${task.TaskStatus}". Expected: "completed"`
            );
        }

        // Update task with rejection status and optional reason
        const updateRequest = db.request().input('taskId', sql.Int, taskId);
        
        if (reason) {
            updateRequest.input('reason', sql.NVarChar, reason);
            await updateRequest.query(
                'UPDATE Tasks SET TaskStatus = \'rejected\', RejectionReason = @reason OUTPUT INSERTED.* WHERE TaskID = @taskId'
            );
        } else {
            await updateRequest.query(
                'UPDATE Tasks SET TaskStatus = \'rejected\' OUTPUT INSERTED.* WHERE TaskID = @taskId'
            );
        }

        // Fetch updated task for response
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        // Notify solver with rejection reason if provided
        if (task.SolverID) {
            const message = reason ? `Task rejected: ${reason}` : 'Your task has been rejected';
            await db.request()
                .input('userId', sql.Int, task.SolverID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, message)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Reject task error:', error);
        sendError(res, 500, 'Failed to reject task', error.message);
    }
});

module.exports = router;
