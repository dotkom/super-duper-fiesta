const logger = require('../logging');
const { getAnonymousUser } = require('../models/user');
const getActiveGenfors = require('../models/meeting').getActiveGenfors;


async function validatePasswordHash(user, passwordHash) {
  const genfors = await getActiveGenfors();
  logger.silly('Checking password hash for user', user, genfors, passwordHash);
  const existingUser = await getAnonymousUser(passwordHash, user.onlinewebId, genfors);
  // using != instead of !== to also catch undefined
  return existingUser != null;
}

async function isRegistered(user, passwordHash) {
  return user.completedRegistration && await validatePasswordHash(user, passwordHash) === true;
}

module.exports = {
  validatePasswordHash,
  isRegistered,
};
