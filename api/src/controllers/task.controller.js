/**
 * Task Controller
 * Handles HTTP requests for task management endpoints
 */
const taskService = require('../services/task.service');
const { successResponse, createdResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * GET /task
 * Get all tasks for the authenticated user (filtered by role)
 */
const getTasks = async (req, res, next) => {
    try {
        const { id: userId, role } = req.user;

        const tasks = await taskService.getTasksByRole(userId, role);

        return successResponse(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /task/:id
 * Get a single task by ID
 */
const getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await taskService.getTaskById(taskId);

        return successResponse(res, task);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /task
 * Create a new task (Author only)
 */
const createTask = async (req, res, next) => {
    try {
        const authorId = req.user.id;

        const task = await taskService.createTask(req.body, authorId);

        return createdResponse(res, task, 'Task created successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /task/:id
 * Update a task
 */
const updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const task = await taskService.updateTask(taskId, req.body, userId);

        return successResponse(res, task, 'Task updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /task/:id/start
 * Start a task (Solver only)
 */
const startTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const solverId = req.user.id;

        const task = await taskService.startTask(taskId, solverId);

        return successResponse(res, task, 'Task started successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /task/:id/complete
 * Complete a task (Solver only)
 */
const completeTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const solverId = req.user.id;

        const task = await taskService.completeTask(taskId, solverId);

        return successResponse(res, task, 'Task completed successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /task/:id/approve
 * Approve a completed task (Author only)
 */
const approveTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const authorId = req.user.id;

        const task = await taskService.approveTask(taskId, authorId);

        return successResponse(res, task, 'Task approved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /task/:id/reject
 * Reject a completed task (Author only)
 */
const rejectTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const authorId = req.user.id;
        const { reason } = req.body;

        const task = await taskService.rejectTask(taskId, authorId, reason);

        return successResponse(res, task, 'Task rejected and reset to started');
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /task/:id
 * Delete a task (Author only)
 */
const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const authorId = req.user.id;

        await taskService.deleteTask(taskId, authorId);

        return successResponse(res, null, 'Task deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    startTask,
    completeTask,
    approveTask,
    rejectTask,
    deleteTask
};
