const winston = require('winston');
const winstonError = require('winston-error');

const consoleLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      exitOnError: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
    }),
  ],
});

winstonError(consoleLogger);

module.exports = consoleLogger;
