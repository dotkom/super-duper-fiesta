const winston = require('winston');
const winstonError = require('winston-error');

const consoleLogger = new (winston.Logger)({});

if (process.env.NODE_ENV !== 'test') {
  consoleLogger.add(winston.transports.Console, {
    level: 'debug',
    exitOnError: false,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    timestamp: true,
  });
}

winstonError(consoleLogger);

module.exports = consoleLogger;
