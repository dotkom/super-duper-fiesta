const logger = require('../logging');
const permissions = require('../../common/auth/permissions');
const { getActiveGenfors } = require('../models/meeting.accessors');
const { addUser } = require('../managers/user');
const { getUserByUsername, updateUserById, getUserById } = require('../models/user.accessors');

function getPermissionLevel(user) {
  if (user.member) {
    return permissions.CAN_VOTE;
  }
  return permissions.IS_LOGGED_IN;
}

function parseOpenIDUserinfo(data) {
  return {
    fullName: data.name,
    username: data.preferred_username,
    onlinewebId: data.preferred_username,
    name: data.name,
    member: data.member,
    superuser: data.superuser,
    staff: data.staff,
  };
}

async function createUser(user) {
  const genfors = await getActiveGenfors();
  const {
    username,
    fullName,
    member,
    superuser,
  } = user;
  const permissionLevel = getPermissionLevel(user);

  try {
    if (!genfors && member && superuser) {
      // No genfors and is superuser, probably want to create genfors.
      logger.info('No active genfors and admin registered. Probably want to create meeting.');
      return addUser(fullName, username, permissions.IS_SUPERUSER);
    } else if (!genfors && permissionLevel < permissions.IS_SUPERUSER) {
      throw new Error('No active genfors');
    }

    const existingUser = await getUserByUsername(username, genfors);
    if (existingUser === null) {
      // Create user if not exists
      logger.debug('User does not exist -- creating', { username });
      const newUser = await addUser(fullName, username, permissionLevel);
      logger.info(`Successfully registered ${newUser.name} for genfors ${newUser.meetingId}`,
        { username, fullName: newUser.name, genfors: newUser.meetingId });
      return newUser;
    }
    logger.silly('Fetched existing user, updating.', { username: user.onlinewebId });
    // Update if user exists
    const updatedUser = await updateUserById(existingUser.id, {
      name: fullName,
      onlinewebId: username,
      permissions: permissionLevel,
    });
    return updatedUser;
  } catch (err) {
    logger.error('Updating user failed.', { username, err: err.message });
    throw err;
  }
}

async function deserializeUser(id, done) {
  logger.silly('Deserializing user', { userId: id });
  const meeting = await getActiveGenfors();
  const user = await getUserById(id);
  if (!user) {
    logger.warn('User tried to login as non-existing user', id);
    done(null, false, 'Unable to find user');
    return;
  }
  const meetingId = meeting && meeting.id;
  if (user.meetingId !== meetingId) {
    logger.silly('Removed invalid user session', id);
    done(null, false, 'User is not connected to current meeting');
    return;
  }
  done(null, () => getUserById(id));
}

module.exports = {
  createUser,
  getPermissionLevel,
  parseOpenIDUserinfo,
  deserializeUser,
};
