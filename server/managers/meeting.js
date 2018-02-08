const logger = require('../logging');
const { createGenfors, getGenfors, getActiveGenfors, updateGenfors } = require('../models/meeting.accessors');

const permissionLevel = require('../../common/auth/permissions');

function publicMeeting(meeting, admin = false) {
  const { id, registrationOpen, status, title, pin } = meeting;
  let publicData = {
    id,
    registrationOpen,
    status,
    title,
  };
  if (admin) {
    publicData = {
      ...publicData,
      pin,
    };
  }
  return publicData;
}

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
  if (!await canEdit(permissionLevel.IS_MANAGER, user, genfors)) {
    throw new Error('User does not have permission to end genfors');
  }
  logger.info('Closing genfors', { genfors: genfors.title });
  return updateGenfors({ id: genfors.id }, { status: 'closed' });
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


async function toggleRegistrationStatus(genfors, currentStatus) {
  // If currentStatus is passed to func, set it to the opposite
  // If currentStatus is not passed to func, set it to the opposite of meeting.registrationOpen
  const registrationOpen = currentStatus !== undefined ? !currentStatus : genfors.registrationOpen;

  // eslint-disable-next-line no-underscore-dangle
  return updateGenfors(genfors,
  { registrationOpen, pin: parseInt(Math.random() * 10000, 10) }, { new: true });
}

module.exports = {
  canEdit,
  endGenfors,
  validatePin,
  addGenfors,
  toggleRegistrationStatus,
  publicMeeting,
};
