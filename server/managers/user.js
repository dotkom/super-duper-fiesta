const logger = require('../logging');
const model = require('../models/user');
const { getActiveGenfors } = require('../models/meeting');
const { hashWithSalt } = require('../utils/crypto');

const permissionLevel = require('../../common/auth/permissions');

async function validatePasswordHash(user, passwordHash) {
  const genfors = await getActiveGenfors();
  logger.silly('Checking password hash for user', user, genfors, passwordHash);
  const existingUser = await model.getAnonymousUser(passwordHash, user.onlinewebId, genfors);
  // using != instead of !== to also catch undefined
  return existingUser != null;
}

async function isRegistered(user, passwordHash) {
  return user.completedRegistration && await validatePasswordHash(user, passwordHash) === true;
}


function addUser(name, onlinewebId, securityLevel) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      // @TODO make sure to connect all users to genfors
      if (!genfors && securityLevel < permissionLevel.IS_SUPERUSER) {
        return reject(new Error('Ingen aktive generalforsamlinger'));
      }
      if (securityLevel >= permissionLevel.IS_SUPERUSER) {
        logger.info('Creating a user with high security clearance.', {
          name, onlinewebId, securityLevel,
        });
      }
      model.addUser({
        genfors,
        name,
        onlinewebId,
        notes: '',
        permissions: securityLevel || 0,
      }).then((user) => {
        logger.debug('Created user', user.name);
        resolve(user);
      }).catch((err) => {
        logger.error('Failed to create user', err);
        reject(err);
      });
      return null;
    }).catch(reject);
  });
}

async function addAnonymousUser(username, passwordHash) {
  const genfors = await getActiveGenfors();
  const user = await model.getUserByUsername(username, genfors);
  if (user.completedRegistration) {
    throw new Error('User is already registered');
  }
  const existingUser = await model.getAnonymousUser(passwordHash, username, genfors);
  if (existingUser) {
    throw new Error('Anonymous user aleady exists');
  }
  await model.addAnonymousUser({
    genfors,
    passwordHash: hashWithSalt(passwordHash, username),
  });
  // eslint-disable-next-line no-underscore-dangle
  await model.updateUserById(user._id, { completedRegistration: true });
}

module.exports = {
  validatePasswordHash,
  isRegistered,
  addUser,
  addAnonymousUser,
};
