/**
 * Validators Index
 */
const authValidators = require('./auth.validator');
const taskValidators = require('./task.validator');
const commonValidators = require('./common.validator');

module.exports = {
    ...authValidators,
    ...taskValidators,
    ...commonValidators
};
