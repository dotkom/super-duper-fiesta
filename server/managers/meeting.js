const logger = require('../logging');
const { createGenfors, getGenfors, getActiveGenfors, closeGenfors } = require('../models/meeting');

const permissionLevel = require('../../common/auth/permissions');

async function canEdit(securityLevel, user, genforsId) {
  logger.silly('Checking permissions');
  const active = await getActiveGenfors();
  // If you are that super, just do it!
  if (user.permissions >= permissionLevel.IS_SUPERUSER) {
    logger.debug('Super user, go for it!');
    return true;
  }
  const genfors = await getGenfors(genforsId);
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
    return true;
  }
  logger.warn('Failed security check', {
    userpermission: user.permissions,
    clearance: securityLevel,
  });
  throw new Error('Brukeren har ikke riktig rettigheter');
}


async function endGenfors(genfors, user) {
  if (await canEdit(permissionLevel.IS_MANAGER, user, genfors)) {
    logger.info('Closing genfors');
    await closeGenfors(genfors.id);
    logger.info('Closed genfors');
  }
}


// TODO add security function
async function addGenfors(title, date, user, force) {
  // Only allow one at a time
  const meeting = await getActiveGenfors();
  // @TODO Prompt user for confirmations and disable active genfors

  if (meeting) {
    if (!force) {
      throw new Error('Meeting in progress, you need to close it or force new');
    }
    await endGenfors(meeting, user);
  }
  return createGenfors(title, date);
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
