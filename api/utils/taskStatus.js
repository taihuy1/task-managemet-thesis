// Task status transition rules
// Prevents invalid state changes (e.g., skipping from 'waiting' to 'approved')
const VALID_TRANSITIONS = {
    'waiting': ['started'],
    'started': ['completed'],
    'completed': ['approved', 'rejected'],
    'approved': [],
    'rejected': []
};

function isValidTransition(currentStatus, newStatus) {
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
}

function getValidNextStatuses(currentStatus) {
    return VALID_TRANSITIONS[currentStatus] || [];
}

module.exports = { isValidTransition, getValidNextStatuses };
