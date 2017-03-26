const logger = require('../logging');
const passport = require('passport');

const getUserById = require('../models/user').getUserById;

require('./providers/ow4.js');

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    logger.silly('Serializing user', { user });
    done(null, user._id); // eslint-disable-line no-underscore-dangle
  });

  passport.deserializeUser((id, done) => {
    logger.silly('Deserializing user', { userId: id });
    getUserById(id).then((user) => {
      logger.silly('Deserialized user', { username: user.onlinewebId, fullName: user.name });
      done(null, user);
    }).catch((err) => {
      logger.error('Error deserializing user', err);
    });
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/login', passport.authenticate('oauth2', { successReturnToOrRedirect: '/' }));
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  app.get('/auth', passport.authenticate('oauth2', { callback: true }), (req, res) => {
    res.redirect('/');
  });
};
