/**
 * Task Service
 * Business logic for task lifecycle management
 * Thesis requirement: waiting → started → completed → approved/rejected
 */
const taskRepository = require('../repositories/task.repository');
const notificationRepository = require('../repositories/notification.repository');
const userRepository = require('../repositories/user.repository');
const { NotFoundError, BadRequestError, AuthorizationError } = require('../utils/errors');
const { isValidTransition, TASK_STATUS, NOTIFICATION_TYPES, ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Get tasks for a user based on their role
 * Authors see their created tasks, Solvers see assigned tasks
 * @param {number} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<Task[]>} List of tasks
 */
const getTasksByRole = async (userId, role) => {
    return taskRepository.findByRole(userId, role);
};

/**
 * Get a single task by ID
 * @param {number} taskId - Task ID
 * @returns {Promise<Task>} Task object
 * @throws {NotFoundError} If task not found
 */
const getTaskById = async (taskId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }
    return task;
};

/**
 * Create a new task
 * @param {Object} taskData - Task creation data
 * @param {number} authorId - Author user ID
 * @returns {Promise<Task>} Created task
 */
const createTask = async (taskData, authorId) => {
    const { title, desc, solvers } = taskData;
    const solverId = solvers[0]; // Currently supporting single solver

    // Verify solver exists and has solver role
    const solver = await userRepository.findById(solverId);
    if (!solver || solver.role !== ROLES.SOLVER) {
        throw new BadRequestError('Invalid solver ID');
    }

    // Create task
    const task = await taskRepository.create({
        title,
        description: desc,
        authorId,
        solverId,
        status: TASK_STATUS.PENDING
    });

    // Create notification for solver
    await notificationRepository.create({
        userId: solverId,
        taskId: task.id,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        message: `You have been assigned a new task: ${title}`
    });

    logger.info(`Task created: "${title}"`, { taskId: task.id, authorId, solverId });

    return task;
};

/**
 * Update task
 * @param {number} taskId - Task ID
 * @param {Object} updateData - Fields to update
 * @param {number} userId - User performing update
 * @returns {Promise<Task>} Updated task
 */
const updateTask = async (taskId, updateData, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    // Validate status transition if status is being changed
    if (updateData.status && updateData.status !== task.status) {
        if (!isValidTransition(task.status, updateData.status)) {
            throw new BadRequestError(
                `Invalid status transition from "${task.status}" to "${updateData.status}"`
            );
        }
    }

    // Map 'desc' to 'description' if present
    if (updateData.desc !== undefined) {
        updateData.description = updateData.desc;
        delete updateData.desc;
    }

    const updatedTask = await taskRepository.update(taskId, updateData);

    logger.info(`Task updated: ${taskId}`, { updatedFields: Object.keys(updateData), userId });

    return updatedTask;
};

/**
 * Start a task (Solver action)
 * Thesis requirement: Changes status from waiting → started
 * @param {number} taskId - Task ID
 * @param {number} solverId - Solver user ID
 * @returns {Promise<Task>} Updated task
 */
const startTask = async (taskId, solverId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    if (task.solverId !== solverId) {
        throw new AuthorizationError('You are not assigned to this task');
    }

    if (task.status !== TASK_STATUS.PENDING) {
        throw new BadRequestError(`Cannot start task with status "${task.status}"`);
    }

    const updatedTask = await taskRepository.update(taskId, { status: TASK_STATUS.STARTED });

    logger.info(`Task started: ${taskId}`, { solverId });

    return updatedTask;
};

/**
 * Complete a task (Solver action)
 * Thesis requirement: Changes status from started → completed
 * @param {number} taskId - Task ID
 * @param {number} solverId - Solver user ID
 * @returns {Promise<Task>} Updated task
 */
const completeTask = async (taskId, solverId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    if (task.solverId !== solverId) {
        throw new AuthorizationError('You are not assigned to this task');
    }

    if (task.status !== TASK_STATUS.STARTED) {
        throw new BadRequestError(`Cannot complete task with status "${task.status}"`);
    }

    const updatedTask = await taskRepository.update(taskId, { status: TASK_STATUS.COMPLETED });

    // Notify author that task is completed
    await notificationRepository.create({
        userId: task.authorId,
        taskId: task.id,
        type: NOTIFICATION_TYPES.TASK_COMPLETED,
        message: `Task "${task.title}" has been completed and awaits your approval`
    });

    logger.info(`Task completed: ${taskId}`, { solverId });

    return updatedTask;
};

/**
 * Approve a task (Author action)
 * Thesis requirement: Changes status from completed → approved
 * @param {number} taskId - Task ID
 * @param {number} authorId - Author user ID
 * @returns {Promise<Task>} Updated task
 */
const approveTask = async (taskId, authorId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    if (task.authorId !== authorId) {
        throw new AuthorizationError('Only the task author can approve this task');
    }

    if (task.status !== TASK_STATUS.COMPLETED) {
        throw new BadRequestError(`Cannot approve task with status "${task.status}"`);
    }

    const updatedTask = await taskRepository.update(taskId, { status: TASK_STATUS.APPROVED });

    // Notify solver that task is approved
    await notificationRepository.create({
        userId: task.solverId,
        taskId: task.id,
        type: NOTIFICATION_TYPES.TASK_APPROVED,
        message: `Your task "${task.title}" has been approved!`
    });

    logger.info(`Task approved: ${taskId}`, { authorId });

    return updatedTask;
};

/**
 * Reject a task (Author action)
 * Thesis requirement: Changes status from completed → started (solver must redo)
 * @param {number} taskId - Task ID
 * @param {number} authorId - Author user ID
 * @param {string} reason - Optional rejection reason
 * @returns {Promise<Task>} Updated task
 */
const rejectTask = async (taskId, authorId, reason = null) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new NotFoundError('Task');
    }

    if (task.authorId !== authorId) {
        throw new AuthorizationError('Only the task author can reject this task');
    }

    if (task.status !== TASK_STATUS.COMPLETED) {
        throw new BadRequestError(`Cannot reject task with status "${task.status}"`);
    }

    // Per thesis requirements, rejected tasks automatically reset to "started"
    // so the solver can immediately continue working on it
    const updatedTask = await taskRepository.update(taskId, { status: TASK_STATUS.STARTED });

    // Notify solver that task is rejected and needs more work
    const message = reason
        ? `Your task "${task.title}" was rejected. Reason: ${reason}. Please revise and resubmit.`
        : `Your task "${task.title}" was rejected. Please revise and resubmit.`;

    await notificationRepository.create({
        userId: task.solverId,
        taskId: task.id,
        type: NOTIFICATION_TYPES.TASK_REJECTED,
        message
    });

    logger.info(`Task rejected: ${taskId}`, { authorId, reason });

    return updatedTask;
};

/**
 * Delete a task (Author action)
 * @param {number} taskId - Task ID
 * @param {number} authorId - Author user ID
 */
const deleteTask = async (taskId, authorId) => {
    const task = await taskRepository.findByIdAndAuthor(taskId, authorId);
    if (!task) {
        throw new NotFoundError('Task not found or access denied');
    }

    // Delete related notifications first
    await notificationRepository.deleteByTaskId(taskId);

    // Delete task
    await taskRepository.deleteById(taskId);

    logger.info(`Task deleted: ${taskId}`, { authorId });
};

module.exports = {
    getTasksByRole,
    getTaskById,
    createTask,
    updateTask,
    startTask,
    completeTask,
    approveTask,
    rejectTask,
    deleteTask
};
