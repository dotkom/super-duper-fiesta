const fetch = require('node-fetch');
const logger = require('../../logging');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const OW4AuthConfig = require('../conf.js').ids;
const OW4API = require('../conf.js').api;

const addUser = require('../../models/user').addUser;
const getUserByUsername = require('../../models/user').getUserByUsername;
const updateUserById = require('../../models/user').updateUserById;
const permissions = require('../../models/permissions');


const getClientInformation = (accessToken, cb) => {
  const OW4UserEndpoint = OW4API.backend + OW4API.userEndpoint;
  fetch(OW4UserEndpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(_ => _.json()).then((body) => {
    const username = body.username;
    const fullName = `${body.first_name} ${body.last_name}`;
    const permissionLevel = body.member ? permissions.CAN_VOTE : permissions.IS_LOGGED_IN;

    // Create user if not
    getUserByUsername(username).then((user) => {
      if (user === null) {
        // Create user if not exists
        logger.debug('User does not exist -- creating', { username });
        addUser(fullName, username, '12345678', permissionLevel).then((newUsers) => {
          const newUser = newUsers.user; // We get user and anonUser objects, but only need user
          logger.info(`Successfully registered ${newUser.name} for genfors ${newUser.genfors}`,
            { username, fullName: newUser.name, genfors: newUser.genfors });
          cb(null, newUser, null);
        }).catch((createUserErr) => {
          logger.error('Creating user failed:', createUserErr);
          cb(createUserErr, null, null);
        });
      } else {
        logger.silly('Fetched existing user, updating.', { username: user.onlinewebId });
        // Update if user exists
        updateUserById(user._id, { // eslint-disable-line no-underscore-dangle
          name: fullName,
          onlinewebId: username,
          permissions: permissionLevel,
        }).then((updatedUser) => {
          cb(null, updatedUser, null);
        }).catch((err) => {
          logger.error('Something went wrong when updating user.', err);
          cb(err, null, null);
        });
      }
    }).catch((err) => {
      logger.error('Updating user failed. Try again.', { username });
      cb(err, null, null);
    });
  }).catch((err) => {
    logger.error('Fetching user from resource failed', err);
  });
};

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
    getClientInformation(accessToken, cb);
  }) // eslint-disable-line comma-dangle
);

