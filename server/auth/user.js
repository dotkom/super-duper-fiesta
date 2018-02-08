const logger = require('../logging');
const permissions = require('../../common/auth/permissions');
const { getActiveGenfors } = require('../models/meeting.accessors');
const { addUser } = require('../managers/user');
const { getUserByUsername, updateUserById } = require('../models/user.accessors');

function getPermissionLevel(user) {
  if (user.member) {
    return permissions.CAN_VOTE;
  }
  return permissions.IS_LOGGED_IN;
}

function parseOW4OAuth2User(data) {
  const fullName = `${data.first_name} ${data.last_name}`;
  return {
    fullName,
    username: data.username,
    onlinewebId: data.username,
    name: fullName,
    member: data.member,
    superuser: data.superuser,
    staff: data.staff,
  };
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
      logger.info(`Successfully registered ${newUser.name} for genfors ${newUser.genfors}`,
        { username, fullName: newUser.name, genfors: newUser.genfors });
      return newUser;
    }
    logger.silly('Fetched existing user, updating.', { username: user.onlinewebId });
    // Update if user exists
    const updatedUser = await updateUserById(existingUser._id, {
      name: fullName,
      onlinewebId: username,
      permissions: permissionLevel,
    });
    return updatedUser;
  } catch (err) {
    logger.error('Updating user failed.', { username, err });
    throw err;
  }
}

module.exports = {
  createUser,
  getPermissionLevel,
  parseOpenIDUserinfo,
  parseOW4OAuth2User,
};
