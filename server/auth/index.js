const passport = require('passport');
const getUserByUsername = require('../models/user').getUserByUsername;

require('./providers/ow4.js');

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    console.log('Serializing user', user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getUserByUsername(id).then((user) => {
      console.log('Deserializing user', user);
      done(null, user.username);
    }).catch((err) => {
      console.log('Error deserializing user', err);
    });
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/login', passport.authenticate('oauth2', {"successReturnToOrRedirect": "/"}));
};
