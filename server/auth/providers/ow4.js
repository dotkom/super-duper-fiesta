const fetch = require('node-fetch');
const logger = require('../../logging');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const OW4AuthConfig = require('../conf.js').ids;
const OW4API = require('../conf.js').api;

const { createUser, parseOW4OAuth2User } = require('../user');


async function getClientInformation(accessToken) {
  const OW4UserEndpoint = OW4API.backend + OW4API.userEndpoint;
  let body;
  try {
    body = await fetch(OW4UserEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(_ => _.json());
  } catch (err) {
    logger.error('Fetching user from resource failed', err);
    throw err;
  }
  return parseOW4OAuth2User(body);
}

passport.use(new OAuth2Strategy(
  {
    authorizationURL: OW4AuthConfig.authorizationURL,
    tokenURL: OW4AuthConfig.tokenURL,
    clientID: OW4AuthConfig.clientID,
    clientSecret: OW4AuthConfig.clientSecret,
    callbackURL: OW4AuthConfig.callbackURL,
    scope: OW4AuthConfig.scope,
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const userInfo = await getClientInformation(accessToken);
      const user = await createUser(userInfo);
      return cb(null, user, null);
    } catch (err) {
      return cb(err, null, null);
    }
  } // eslint-disable-line comma-dangle
));

module.exports = {
  getClientInformation,
};
