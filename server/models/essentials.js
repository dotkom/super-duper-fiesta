const mongoose = require('mongoose');
const logger = require('../logging');

const DB_URL = process.env.SDF_DATABASE_URL;
const DB_NAME = process.env.SDF_DATABASE_NAME || 'sdf';

const DB_CONN_STR = DB_URL || `mongodb://localhost/${DB_NAME}`;

// connecting to db

logger.info(`Connecting to mongodb using '${DB_CONN_STR}'`);
mongoose.Promise = global.Promise;
mongoose.connect(DB_CONN_STR);

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Could not connect to database.', { err });
});
