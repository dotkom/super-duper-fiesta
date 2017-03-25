const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const getUserByUsername = require('../../models/user').getUserByUsername;
const OW4AuthConfig = require('../conf.js').ids;

passport.use(new OAuth2Strategy(
  {
    authorizationURL: OW4AuthConfig.authorizationURL,
    tokenURL: OW4AuthConfig.tokenURL,
    clientID: OW4AuthConfig.clientID,
    clientSecret: OW4AuthConfig.clientSecret,
    callbackURL: OW4AuthConfig.callbackURL,
  },
  (accessToken, refreshToken, profile, cb) => {
    const adminUsername = 'admin'; // @ToDo: Get username from OW4 Users API endpoint
    getUserByUsername(adminUsername).then((user) => {
      console.log('shit worked l0l');
      cb(null, user, null);
    }).catch((err) => {
      console.log('Something went wrong when getting user:', err);
      cb(err, null, null);
    });
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //  return cb(err, user);
    // });
  })
);

