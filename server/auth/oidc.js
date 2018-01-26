const { Strategy } = require('openid-client');
const Passport = require('passport');

const logger = require('../logging');
const Issuer = require('openid-client').Issuer;

const { createUser, parseOpenIDUserinfo } = require('./user');


async function getOIDCClient() {
  const provider = process.env.SDF_OIDC_PROVIDER;
  const clientId = process.env.SDF_OIDC_CLIENT_ID;

  if (!provider || !clientId) {
    logger.crit('Did not provide "SDF_OIDC_PROVIDER" and "SDF_OIDC_CLIENT_ID" when using OIDC.');
  }

  logger.debug('Discovering OIDC issuer.', { provider });
  let issuer;

  try {
    issuer = await Issuer.discover(provider);
    logger.debug('Setting up OIDC issuer', { provider });
  } catch (err) {
    logger.error('Discovering issuer failed.', err);
    return null; // Ugly :'(
  }
  return new issuer.Client({ client_id: clientId });
}

function configureOIDCPassport(client) {
  const params = {
    redirect_uri: process.env.SDF_OIDC_REDIRECT_URI,
    scope: 'openid profile onlineweb4',
  };
  const passReqToCallback = false;
  const usePKCE = false;

  Passport.use('oidc',
    new Strategy({ client, params, passReqToCallback, usePKCE },
      async (tokenset, userinfo, done) =>
        done(null, await createUser(parseOpenIDUserinfo(userinfo)),
      ),
    ),
  );

  logger.info('Successfully set up the OIDC client.');
}

async function setupOIDC() {
  let client;
  try {
    client = await getOIDCClient();
  } catch (err) {
    logger.error('Getting OIDC client failed', err);
  }

  if (client !== null) {
    await configureOIDCPassport(client);
  }
}

module.exports = {
  configureOIDCPassport,
  getOIDCClient,
  setupOIDC,
};
