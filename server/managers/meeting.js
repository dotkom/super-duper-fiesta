const logger = require('../logging');
const { createGenfors, getGenfors, getActiveGenfors, closeGenfors } = require('../models/meeting');

const permissionLevel = require('../../common/auth/permissions');

function canEdit(securityLevel, user, genforsId) {
  return new Promise((resolve, reject) => {
    logger.silly('Checking permissions');
    getActiveGenfors().then((active) => {
      // If you are that super, just do it!
      if (user.permissions >= permissionLevel.IS_SUPERUSER) {
        logger.debug('Super user, go for it!');
        resolve(true);
        return;
      }
      getGenfors(genforsId)
      .then((genfors) => {
        logger.silly('security check', {
          active: active.id,
          genfors: genfors.id,
          usergenfors: user.genfors.toString(),
          userperms: user.permissions,
          securityLevel,
        });
        // Checking if current genfors == requested genfors == user genfors
        // But if user is superuser it is not nessecary
        if ((active.id === genfors.id)
          && (genfors.id === user.genfors.toString())
          && (user.permissions >= securityLevel)) {
          logger.silly('Cleared security check');
          resolve(true);
        } else {
          logger.warn('Failed security check', {
            userpermission: user.permissions,
            clearance: securityLevel,
          });
          reject(new Error('User does not have the required permissions.'));
        }
      }).catch((err) => {
        logger.error('Unable to fetch specific genfors', err);
        reject(err);
      });
    }).catch((err) => {
      logger.error('Unable to fetch genfors', err);
      reject(err);
    });
  });
}


function endGenfors(genfors, user) {
  return new Promise((resolve, reject) => {
    canEdit(permissionLevel.IS_MANAGER, user, genfors).then(() => {
      logger.info('Closing genfors');
      closeGenfors(genfors.id).then(() => {
        logger.info('Closed genfors');
        resolve();
      }).catch(reject);
    }).then(resolve).catch(reject);
  });
}


// TODO add security function
function addGenfors(title, date, user, force) {
  // Only allow one at a time
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((meeting) => {
      // @TODO Prompt user for confirmations and disable active genfors

      if (meeting) {
        if (!force) {
          return reject(new Error('Meeting in progress, you need to close it or force new'));
        }
        endGenfors(meeting, user).then(addGenfors(title, date, user, true));
      }
      createGenfors(title, date).then((newMeeting) => {
        resolve(newMeeting);
      });
      return null;
    });
  });
}


async function validatePin(pin) {
  const genfors = await getActiveGenfors();
  return genfors.pin === pin;
}

module.exports = {
  canEdit,
  validatePin,
  addGenfors,
};
