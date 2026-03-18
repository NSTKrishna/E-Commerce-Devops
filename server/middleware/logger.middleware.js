const morgan = require('morgan');

// Custom format or standard 'dev' format
const logger = morgan('dev');

module.exports = logger;
