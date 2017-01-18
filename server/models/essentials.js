const mongoose = require('mongoose');
const logger = require('../logging');

// connecting to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Could not connect to database.', { err });
});
