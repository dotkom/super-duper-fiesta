jest.mock('../../models/user');
const request = require('supertest');
const express = require('express');
const auth = require('../index');
const authProviderConfig = require('../conf');

const server = express();
let app;

describe('auth', () => {
  beforeAll(async () => {
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
