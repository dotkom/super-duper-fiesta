const winston = require('winston');
const winstonError = require('winston-error');

const levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
    database: 6,
  },
};

const consoleLogger = new (winston.Logger)({ levels: levels.levels });

if (process.env.NODE_ENV !== 'test') {
  consoleLogger.add(winston.transports.Console, {
    level: process.env.SDF_LOGLEVEL || 'database',
    exitOnError: false,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    timestamp: true,
  });
}

winstonError(consoleLogger);

module.exports = consoleLogger;
