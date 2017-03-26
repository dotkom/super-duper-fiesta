const OW4_OAUTH2_PROVIDER_BACKEND = process.env.SDF_OAUTH2_PROVIDER_BACKEND || '';

const OW4OAUTH2_SETUP = {
  authorizationURL: OW4_OAUTH2_PROVIDER_BACKEND + process.env.SDF_OAUTH2_AUTHORIZATION_URL || '',
  tokenURL: OW4_OAUTH2_PROVIDER_BACKEND + process.env.SDF_OAUTH2_TOKEN_URL || '',
  clientID: process.env.SDF_OAUTH2_CLIENT_ID || '',
  clientSecret: process.env.SDF_OAUTH2_CLIENT_SECRET || '',
  callbackURL: process.env.SDF_OAUTH2_CALLBACK_URL || '',
  scope: ['authentication.onlineuser.username.read',
    'authentication.onlineuser.first_name.read',
    'authentication.onlineuser.last_name.read',
    'authentication.onlineuser.email.read',
    'authentication.onlineuser.is_member.read',
    'authentication.onlineuser.field_of_study.read',
    'authentication.onlineuser.nickname.read',
    'authentication.onlineuser.rfid.read'].join(' '),
};

module.exports = {
  ids: OW4OAUTH2_SETUP,
  api: {
    backend: process.env.SDF_OAUTH2_RESOURCE_BACKEND,
    userEndpoint: process.env.SDF_OW4_USERS_API_ENDPOINT,
  },
};
