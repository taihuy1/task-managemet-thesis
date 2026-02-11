/**
 * Application Constants
 * Centralized constants for task statuses, roles, and error codes
 */

/**
 * User Roles
 * Thesis requirement: Authors create/assign, Solvers complete
 */
/**
 * User Roles
 * Thesis requirement: Authors create/assign, Solvers complete
 */
const ROLES = {
    AUTHOR: 'AUTHOR',
    SOLVER: 'SOLVER'
};

/**
 * Task Status Values
 * Thesis requirement: waiting → started → completed → approved/rejected
 */
const TASK_STATUS = {
    PENDING: 'PENDING', // Was 'waiting'
    STARTED: 'STARTED',
    COMPLETED: 'COMPLETED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
};

/**
 * Valid Status Transitions
 * Defines the allowed state machine transitions
 */
const STATUS_TRANSITIONS = {
    [TASK_STATUS.PENDING]: [TASK_STATUS.STARTED],
    [TASK_STATUS.STARTED]: [TASK_STATUS.COMPLETED],
    [TASK_STATUS.COMPLETED]: [TASK_STATUS.APPROVED, TASK_STATUS.REJECTED],
    [TASK_STATUS.APPROVED]: [], // Final state
    [TASK_STATUS.REJECTED]: [TASK_STATUS.STARTED] // Can restart after rejection
};

/**
 * Check if a status transition is valid
 * @param {string} currentStatus - Current task status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} True if transition is allowed
 */
const isValidTransition = (currentStatus, newStatus) => {
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
};

/**
 * Notification Types
 */
const NOTIFICATION_TYPES = {
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_APPROVED: 'TASK_APPROVED',
    TASK_REJECTED: 'TASK_REJECTED',
    TASK_STARTED: 'TASK_STARTED',
    TASK_COMPLETED: 'TASK_COMPLETED'
};

/**
 * HTTP Status Codes (for reference)
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    INTERNAL_ERROR: 500
};

module.exports = {
    ROLES,
    TASK_STATUS,
    STATUS_TRANSITIONS,
    isValidTransition,
    NOTIFICATION_TYPES,
    HTTP_STATUS
};
