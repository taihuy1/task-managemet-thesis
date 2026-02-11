/**
 * Task Routes
 * CRUD operations and lifecycle actions for tasks
 */
const express = require('express');
const router = express.Router();

const { taskController } = require('../controllers');
const { authenticateToken, authorizeRole, requireDatabase, validateRequest, validateParams } = require('../middleware');
const { createTaskSchema, updateTaskSchema, rejectTaskSchema, idSchema } = require('../validators');

// GET /task - Get all tasks for user
router.get('/',
    authenticateToken,
    requireDatabase,
    taskController.getTasks
);

// GET /task/:id - Get single task
router.get('/:id',
    authenticateToken,
    requireDatabase,
    validateParams(idSchema),
    taskController.getTaskById
);

// POST /task - Create new task (Author only)
router.post('/',
    authenticateToken,
    authorizeRole('author'),
    requireDatabase,
    validateRequest(createTaskSchema),
    taskController.createTask
);

// PUT /task/:id - Update task
router.put('/:id',
    authenticateToken,
    requireDatabase,
    validateParams(idSchema),
    validateRequest(updateTaskSchema),
    taskController.updateTask
);

// PATCH /task/:id/start - Start task (Solver only)
router.patch('/:id/start',
    authenticateToken,
    authorizeRole('solver'),
    requireDatabase,
    validateParams(idSchema),
    taskController.startTask
);

// PATCH /task/:id/complete - Complete task (Solver only)
router.patch('/:id/complete',
    authenticateToken,
    authorizeRole('solver'),
    requireDatabase,
    validateParams(idSchema),
    taskController.completeTask
);

// PATCH /task/:id/approve - Approve task (Author only)
router.patch('/:id/approve',
    authenticateToken,
    authorizeRole('author'),
    requireDatabase,
    validateParams(idSchema),
    taskController.approveTask
);

// PATCH /task/:id/reject - Reject task (Author only)
router.patch('/:id/reject',
    authenticateToken,
    authorizeRole('author'),
    requireDatabase,
    validateParams(idSchema),
    validateParams(idSchema),
    validateRequest(rejectTaskSchema),
    taskController.rejectTask
);

// DELETE /task/:id - Delete task (Author only)
router.delete('/:id',
    authenticateToken,
    authorizeRole('author'),
    requireDatabase,
    validateParams(idSchema),
    taskController.deleteTask
);

module.exports = router;
