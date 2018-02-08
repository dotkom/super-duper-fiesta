const logger = require('../logging');
const passport = require('passport');
const { setupOIDC } = require('./oidc');

const getUserById = require('../models/user.accessors').getUserById;

require('./providers/ow4.js');

module.exports = async (app) => {
  passport.serializeUser((user, done) => {
    logger.silly('Serializing user', { user });
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    logger.silly('Deserializing user', { userId: id });
    done(null, () => getUserById(id));
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
  if (process.env.SDF_OIDC && process.env.SDF_OIDC.toLowerCase() === 'true') {
    const success = await setupOIDC();
    if (success) {
      app.get('/openid-login', passport.authenticate('oidc'));
      app.get('/openid-auth', passport.authenticate('oidc', { successRedirect: '/', failureRedirect: '/openid-login' }));
    }
    return app;
  }
  return app;
};
