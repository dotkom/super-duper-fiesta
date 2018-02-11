const request = require('supertest');
const express = require('express');
const session = require('express-session');
const auth = require('../index');
const { Issuer } = require('openid-client');

Issuer.discover = () => new Issuer({
  issuer: process.env.SDF_OIDC_PROVIDER,
  authorization_endpoint: `${process.env.SDF_OIDC_PROVIDER}/authorize`,
});

let server;
let app;

async function getApp() {
  server = express();
  server.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'super secret',
  }));

  return auth(server);
}

describe('auth', () => {
  beforeAll(async () => {
    app = await getApp();
  });

  it.skip('redirects to auth provider when hitting /login', async () => {
    process.env.SDF_OIDC_PROVIDER = 'http://example.org/openid';
    process.env.SDF_OIDC_CLIENT_ID = '123456';
    const response = await request(app).get('/auth');
    expect(response.statusCode).toEqual(302);
    expect(response.header).toEqual(
      expect.objectContaining({
        location: expect.stringContaining(process.env.SDF_OIDC_PROVIDER),
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

describe('openid enabled', () => {
  beforeEach(async () => {
    process.env.SDF_OIDC_PROVIDER = 'http://example.org/openid';
    process.env.SDF_OIDC_CLIENT_ID = '123456';
  });

  afterEach(() => {
    process.env.SDF_OIDC_PROVIDER = '';
    process.env.SDF_OIDC_CLIENT_ID = '';
  });

  it('redirects to OpenID provider when OIDC enabled', async () => {
    app = await getApp();
    const response = await request(app).get('/login');
    expect(response.statusCode).toEqual(302);
    expect(response.header).toEqual(
      expect.objectContaining({
        location: expect.stringContaining(process.env.SDF_OIDC_PROVIDER),
      }),
    );
  });
});
