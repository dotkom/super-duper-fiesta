const OW4OAUTH2_SETUP = {
  authorizationURL: process.env.SDF_OAUTH2_AUTHORIZATION_URL || '',
  tokenURL: process.env.SDF_OAUTH2_TOKEN_URL || '',
  clientID: process.env.SDF_OAUTH2_CLIENT_ID || '',
  clientSecret: process.env.SDF_OAUTH2_CLIENT_SECRET || '',
  callbackURL: process.env.SDF_OAUTH2_CALLBACK_URL || '',
};

module.exports = {
  ids: OW4OAUTH2_SETUP,
  api: {
    backend: process.env.SDF_OAUTH2_RESOURCE_BACKEND,
    user_endpoint: process.env.SDF_OW4_USERS_API_ENDPOINT,
  },
};
