/**
 * Task Repository
 * Database operations for Task entities
 * Isolates Prisma queries from business logic
 */
const { prisma } = require('../config/database.config');

/**
 * Create a new task
 * @param {Object} taskData - Task creation data
 * @returns {Promise<Task>} Created task
 */
const create = async (taskData) => {
    return prisma.task.create({
        data: taskData
    });
};

/**
 * Find task by ID
 * @param {number} taskId - Task ID
 * @returns {Promise<Task|null>} Task object or null
 */
const findById = async (taskId) => {
    return prisma.task.findUnique({
        where: { id: taskId }
    });
};

/**
 * Find tasks by role-based filter
 * Authors see tasks they created, Solvers see tasks assigned to them
 * @param {number} userId - User ID
 * @param {string} role - User role ('author' or 'solver')
 * @returns {Promise<Task[]>} List of tasks
 */
const findByRole = async (userId, role) => {
    const whereClause = role === 'author'
        ? { authorId: userId }
        : { solverId: userId };

    return prisma.task.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Update task
 * @param {number} taskId - Task ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Task>} Updated task
 */
const update = async (taskId, updateData) => {
    return prisma.task.update({
        where: { id: taskId },
        data: updateData
    });
};

/**
 * Delete task by ID
 * @param {number} taskId - Task ID
 * @returns {Promise<Task>} Deleted task
 */
const deleteById = async (taskId) => {
    return prisma.task.delete({
        where: { id: taskId }
    });
};

/**
 * Check if user is the author of a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is author
 */
const isAuthor = async (taskId, userId) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { authorId: true }
    });
    return task?.authorId === userId;
};

/**
 * Check if user is the solver of a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is solver
 */
const isSolver = async (taskId, userId) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { solverId: true }
    });
    return task?.solverId === userId;
};

/**
 * Find task with author ownership check
 * @param {number} taskId - Task ID
 * @param {number} authorId - Author user ID
 * @returns {Promise<Task|null>} Task if owned by author
 */
const findByIdAndAuthor = async (taskId, authorId) => {
    return prisma.task.findFirst({
        where: { id: taskId, authorId }
    });
};

module.exports = {
    create,
    findById,
    findByRole,
    update,
    deleteById,
    isAuthor,
    isSolver,
    findByIdAndAuthor
};
