jest.mock('../../models/user');
const express = require('express');
const request = require('supertest');
const auth = require('../index');

const authProviderConfig = require('../conf');

const { getUserById } = require('../../models/user');
const { generateUser } = require('../../utils/generateTestData');

const app = express();
auth(app);


describe('auth', () => {
  beforeAll(() => {
    getUserById.mockImplementation(id => generateUser({ _id: id }));
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
