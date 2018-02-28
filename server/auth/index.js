const passport = require('passport');
const { setupOIDC } = require('./oidc');
const { deserializeUser } = require('./user');

module.exports = async (app) => {
  await setupOIDC();

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(deserializeUser);
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
