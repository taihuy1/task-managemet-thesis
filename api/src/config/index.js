/**
 * Config Index
 * Export all configuration modules
 */
const authConfig = require('./auth.config');
const appConfig = require('./app.config');
const databaseConfig = require('./database.config');

module.exports = {
    ...authConfig,
    ...appConfig,
    ...databaseConfig
};
