const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const getUserByUsername = require('../../models/user').getUserByUsername;
const OW4AuthConfig = require('../conf').ids.OW4OAUTH2_SETUP;

passport.use(new OAuth2Strategy({
  authorizationURL: OW4AuthConfig.authorizationURL,
  tokenURL: OW4AuthConfig.tokenURL,
  clientID: OW4AuthConfig.clientID,
  clientSecret: OW4AuthConfig.clientSecret,
  callbackURL: OW4AuthConfig.callbackURL,
},
(accessToken, refreshToken, profile, cb) => {
  console.log(`Getting user by name for ${profile}`);
  getUserByUsername(profile.username).then(cb).catch((err) => {
    console.log('Something went wrong when getting user:', err);
  });
  // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
  //  return cb(err, user);
  // });
},
));

