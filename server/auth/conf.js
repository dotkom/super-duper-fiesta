const logger = require('../logging');

const OW4_OAUTH2_PROVIDER_BACKEND = process.env.SDF_OAUTH2_PROVIDER_BACKEND || '';

const OW4OAUTH2_SETUP = {
  authorizationURL: OW4_OAUTH2_PROVIDER_BACKEND + (process.env.SDF_OAUTH2_AUTHORIZATION_URL || '/sso/o/authorize/'),
  tokenURL: OW4_OAUTH2_PROVIDER_BACKEND + (process.env.SDF_OAUTH2_TOKEN_URL || '/sso/o/token/'),
  clientID: process.env.SDF_OAUTH2_CLIENT_ID || 'default_key',
  clientSecret: process.env.SDF_OAUTH2_CLIENT_SECRET || '',
  callbackURL: process.env.SDF_OAUTH2_CALLBACK_URL || 'http://127.0.0.1:8080/auth',
  scope: ['authentication.onlineuser.username.read',
    'authentication.onlineuser.first_name.read',
    'authentication.onlineuser.last_name.read',
    'authentication.onlineuser.email.read',
    'authentication.onlineuser.is_member.read',
    'authentication.onlineuser.is_staff.read',
    'authentication.onlineuser.is_superuser.read',
    'authentication.onlineuser.field_of_study.read',
    'authentication.onlineuser.nickname.read',
    'authentication.onlineuser.rfid.read'].join(' '),
};

logger.info(`Running OAuth2 against ${OW4_OAUTH2_PROVIDER_BACKEND}`);

module.exports = {
  ids: OW4OAUTH2_SETUP,
  api: {
    backend: process.env.SDF_OAUTH2_RESOURCE_BACKEND || '',
    userEndpoint: process.env.SDF_OW4_USERS_API_ENDPOINT || '/sso/user/',
  },
};
