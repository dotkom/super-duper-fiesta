const request = require('supertest');
const express = require('express');
const session = require('express-session');
const auth = require('../index');
const authProviderConfig = require('../conf');
const { Issuer } = require('openid-client');

Issuer.discover = () => new Issuer({
  issuer: process.env.SDF_OIDC_PROVIDER,
  authorization_endpoint: `${process.env.SDF_OIDC_PROVIDER}/authorize`,
});

let server;
let app;

describe('auth', () => {
  beforeAll(async () => {
    server = express();
    app = await auth(server);
  });

  it('redirects to auth provider when hitting /login', async () => {
    const response = await request(app).get('/auth');
    expect(response.statusCode).toEqual(302);
    expect(response.header).toEqual(
      expect.objectContaining({
        location: expect.stringContaining(authProviderConfig.authProviderBackend),
      }),
    );
  });

  it('redirects to base page after logging out', async () => {
    const response = await request(app).get('/logout');
    expect(response.statusCode).toEqual(302);
    expect(response.header).toEqual(
      expect.objectContaining({
        location: '/',
      }),
    );
  });
});

async function getApp() {
  server = express();
  server.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'super secret',
  }));
  return auth(server);
}

describe('openid enabled', () => {
  beforeEach(async () => {
    process.env.SDF_OIDC = 'true';
    process.env.SDF_OIDC_PROVIDER = 'http://example.org/openid';
    process.env.SDF_OIDC_CLIENT_ID = '123456';
  });

  afterEach(() => {
    process.env.SDF_OIDC = '';
    process.env.SDF_OIDC_PROVIDER = '';
    process.env.SDF_OIDC_CLIENT_ID = '';
  });

  it('redirects to OpenID provider when OIDC enabled', async () => {
    app = await getApp();
    const response = await request(app).get('/openid-login');
    expect(response.statusCode).toEqual(302);
    expect(response.header).toEqual(
      expect.objectContaining({
        location: expect.stringContaining(process.env.SDF_OIDC_PROVIDER),
      }),
    );
  });

  it('does not add routes if missing configuration details', async () => {
    process.env.SDF_OIDC_PROVIDER = '';
    app = await getApp();

    const response = await request(app).get('/openid-login');
    expect(response.statusCode).toEqual(404);
  });

  it('does not add routes if OpenID autodiscovery fails', async () => {
    Issuer.discover = () => { throw Error(); };
    app = await getApp();

    const response = await request(app).get('/openid-login');
    expect(response.statusCode).toEqual(404);
  });
});

describe('openid disabled', () => {
  beforeEach(async () => {
    process.env.SDF_OIDC = '';
    app = await getApp();
  });

  it('does not add routes if OpenID not enabled', async () => {
    const response = await request(app).get('/openid-login');
    expect(response.statusCode).toEqual(404);
  });
});
