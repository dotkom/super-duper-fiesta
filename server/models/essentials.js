const mongoose = require('mongoose');
const logger = require('../logging');
const getActiveGenfors = require('./meeting').getActiveGenfors;

// connecting to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Could not connect to database.', { err });
});

// Useful functions
function handleError(err) {
  logger.error('Error doing something', { err });
}

function canEdit(securityLevel, user, genfors, cb) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((active) => {
      logger.silly('security check', {
        active: active.id,
        genfors: genfors.id,
        usergenfors: user.genfors.toString(),
        userperms: user.permissions,
        securityLevel,
      });
      if (active.id === genfors.id && genfors.id === user.genfors.toString()
      && user.permissions >= securityLevel) {
        logger.debug('cleared security check');
        resolve(true);
        cb();
      } else {
        logger.error('Failed security check', {
          userpermission: user.permission,
          clearance: securityLevel,
        });
        reject(new Error('User does not have the required permissions.'));
      }
    }).catch(reject);
  });
}

module.exports = {
  handleError,
  canEdit,
};
