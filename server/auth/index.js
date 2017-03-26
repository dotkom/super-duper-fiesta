const passport = require('passport');
const getUserById = require('../models/user').getUserById;

require('./providers/ow4.js');

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    console.log('Serializing user', user);
    done(null, user._id); // eslint-disable-line no-underscore-dangle
  });

  passport.deserializeUser((id, done) => {
    console.log(`Deserializing user by id ${id}`);
    getUserById(id).then((user) => {
      console.log('Deserialized user', user.name);
      done(null, user);
    }).catch((err) => {
      console.log('Error deserializing user', err);
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
