const mongoose = require('mongoose');
const logger = require('../logging');


const Schema = mongoose.Schema;


const GenforsSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'open' }, // Open/Closed/Whatever
  pin: { type: Number, required: true, default: parseInt(Math.random() * 10000, 10) },
  password: { type: String, required: true },
});
const Genfors = mongoose.model('Genfors', GenforsSchema);


function getActiveGenfors() {
  return Genfors.findOne({ status: 'open' }).exec();
}

function canEdit(securityLevel, user, genfors, cb) {
  return new Promise((resolve, reject) => {
    logger.debug('checking permissions');
    getActiveGenfors().then((active) => {
      logger.silly('security check', {
        active: active.id,
        genfors: genfors.id,
        usergenfors: user.genfors.toString(),
        userperms: user.permissions,
        securityLevel,
      });
      // Checking if current genfors == requested genfors == user genfors
      // But if user is superuser it is not nessecary
      if (active.id === genfors.id
         && (genfors.id === user.genfors.toString() || user.permissions >= 3)
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
    }).catch((err) => {
      logger.error('Unable to fetch genfors', err);
    });
  });
}

function endGenfors(genfors, user) {
  return new Promise((resolve, reject) => {
    canEdit(3, user, genfors, () => {
      Genfors.update({ _id: genfors }, { status: 'Closed' });
      resolve();
    }).then(resolve).catch(reject);
  });
}

// TODO add security function
function addGenfors(title, date, passwordHash, force) {
  // Only allow one at a time
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((meeting) => {
      // @TODO Prompt user for confirmations and disable active genfors

      if (meeting) {
        if (!force) {
          return reject(new Error('Meeting in progress, you need to close it or force new'));
        }
        endGenfors(genfors, user)
      }
      // Add a new genfors
      const genfors = new Genfors({
        title,
        date,
        password: passwordHash,
      });
      genfors.save();
      return null;
    });
  });
}


module.exports = {
  addGenfors,
  endGenfors,
  getActiveGenfors,
  canEdit,
};
