const logger = require('../logging');
const passport = require('passport');
const { setupOIDC } = require('./oidc');

const getUserById = require('../models/user.accessors').getUserById;

module.exports = async (app) => {
  await setupOIDC();

  passport.serializeUser((user, done) => {
    logger.silly('Serializing user', { userId: user.id });
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    logger.silly('Deserializing user', { userId: id });
    done(null, () => getUserById(id));
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/login', passport.authenticate('oidc'));
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  app.get('/auth', passport.authenticate('oidc', { successRedirect: '/', failureRedirect: '/' }));
  return app;
};
