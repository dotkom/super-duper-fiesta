const passport = require('passport');
const getUserByUsername = require('../models/user').getUserByUsername;


module.exports = () => {
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
};
