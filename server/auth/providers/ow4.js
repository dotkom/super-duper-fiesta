const fetch = require('node-fetch');
const logger = require('../../logging');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const OW4AuthConfig = require('../conf.js').ids;
const OW4API = require('../conf.js').api;

const addUser = require('../../managers/user').addUser;
const getUserByUsername = require('../../models/user').getUserByUsername;
const updateUserById = require('../../models/user').updateUserById;
const permissions = require('../../../common/auth/permissions');
const { getActiveGenfors } = require('../../models/meeting');


function getPermissionLevel(body) {
  if (body.superuser) {
    return permissions.IS_SUPERUSER;
  } else if (body.member) {
    return permissions.CAN_VOTE;
  }
  return permissions.IS_LOGGED_IN;
}

async function getClientInformation(accessToken) {
  const genfors = await getActiveGenfors();
  const OW4UserEndpoint = OW4API.backend + OW4API.userEndpoint;
  let body;
  try {
    body = await fetch(OW4UserEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(_ => _.json());
  } catch (err) {
    logger.error('Fetching user from resource failed', err);
    throw err;
  }
  const username = body.username;
  const fullName = `${body.first_name} ${body.last_name}`;
  const permissionLevel = getPermissionLevel(body);

  try {
    if (!genfors && permissionLevel < permissions.IS_SUPERUSER) {
      throw new Error('No active genfors');
    } else if (!genfors && permissionLevel >= permissions.IS_SUPERUSER) {
      // No genfors and is superuser, probably want to create genfors.
      logger.info('No active genfors and admin registered. Probably want to create meeting.');
      return await addUser(fullName, username, permissionLevel);
    }

    const user = await getUserByUsername(username, genfors);
    if (user === null) {
      // Create user if not exists
      logger.debug('User does not exist -- creating', { username });
      const newUser = await addUser(fullName, username, permissionLevel);
      logger.info(`Successfully registered ${newUser.name} for genfors ${newUser.genfors}`,
        { username, fullName: newUser.name, genfors: newUser.genfors });
      return newUser;
    }
    logger.silly('Fetched existing user, updating.', { username: user.onlinewebId });
    // Update if user exists
    const updatedUser = await updateUserById(user._id, { // eslint-disable-line no-underscore-dangle
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

passport.use(new OAuth2Strategy(
  {
    authorizationURL: OW4AuthConfig.authorizationURL,
    tokenURL: OW4AuthConfig.tokenURL,
    clientID: OW4AuthConfig.clientID,
    clientSecret: OW4AuthConfig.clientSecret,
    callbackURL: OW4AuthConfig.callbackURL,
    scope: OW4AuthConfig.scope,
  },
  (accessToken, refreshToken, profile, cb) => {
    getClientInformation(accessToken).then((user) => {
      cb(null, user, null);
    }).catch((err) => {
      cb(err, null, null);
    });
  } // eslint-disable-line comma-dangle
));
