const logger = require('../logging');
const model = require('../models/user.accessors');
const { getActiveGenfors } = require('../models/meeting.accessors');
const { hashWithSalt } = require('../utils/crypto');

const permissionLevel = require('../../common/auth/permissions');

function publicUser(user, admin = false) {
  const { _id, name, canVote, registerDate, permissions, completedRegistration } = user;
  let publicData = {
    _id,
    name,
    canVote,
  };
  if (admin) {
    publicData = {
      ...publicData,
      registerDate,
      permissions,
      completedRegistration,
    };
  }
  return publicData;
}


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


async function addUser(name, onlinewebId, securityLevel) {
  const genfors = await getActiveGenfors();
  if (!genfors) {
    logger.warn(`No active genfors when creating user '${name}' ('${onlinewebId}')`);
  }

  if (!genfors && securityLevel < permissionLevel.IS_SUPERUSER) {
    throw new Error('Ingen aktive generalforsamlinger');
  }

  if (securityLevel >= permissionLevel.IS_SUPERUSER) {
    logger.info('Creating a user with high security clearance.', {
      name, onlinewebId, securityLevel,
    });
  }

  try {
    const user = await model.addUser({
      genfors,
      name,
      onlinewebId,
      notes: '',
      permissions: securityLevel || 0,
    });
    logger.debug('Created user', user.name);
    return user;
  } catch (err) {
    logger.error('Failed to create user', err);
    throw err;
  }
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

async function setUserPermissions(id, requestedPermissions) {
  const permissions = requestedPermissions || permissionLevel.IS_MANAGER;
  return model.updateUserById(id, { permissions }, { new: true });
}

module.exports = {
  validatePasswordHash,
  isRegistered,
  addUser,
  addAnonymousUser,
  setUserPermissions,
  publicUser,
};
