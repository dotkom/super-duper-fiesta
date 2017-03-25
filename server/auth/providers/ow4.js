const fetch = require('node-fetch');
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
        console.log('User does not exist -- creating');
        addUser(fullName, username, '12345678', permissionLevel).then((newUsers) => {
          const newUser = newUsers.user; // We get user and anonUser objects, but only need user
          console.log(`Successfully registered ${newUser.name} for genfors ${newUser.genfors}`);
          cb(null, newUser, null);
        }).catch((createUserErr) => {
          console.log('Creating user failed:', createUserErr);
          cb(createUserErr, null, null);
        });
      } else {
        console.log('Fetched existing user, updating.');
        // Update if user exists
        updateUserById(user._id, { // eslint-disable-line no-underscore-dangle
          name: fullName,
          onlinewebId: username,
          permissions: permissionLevel,
        }).then((updatedUser) => {
          cb(null, updatedUser, null);
        }).catch((err) => {
          console.log('Something went wrong when updating user.', err);
          cb(err, null, null);
        });
      }
    }).catch((err) => {
      console.log('Updating user failed. Try again.');
      cb(err, null, null);
    });
  }).catch((err) => {
    console.log('Fetching user from resource failed', err);
  });
};

passport.use(new OAuth2Strategy(
  {
    authorizationURL: OW4AuthConfig.authorizationURL,
    tokenURL: OW4AuthConfig.tokenURL,
    clientID: OW4AuthConfig.clientID,
    clientSecret: OW4AuthConfig.clientSecret,
    callbackURL: OW4AuthConfig.callbackURL,
  },
  (accessToken, refreshToken, profile, cb) => {
    getClientInformation(accessToken, cb);
  }) // eslint-disable-line comma-dangle
);

