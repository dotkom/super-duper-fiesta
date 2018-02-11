jest.mock('../../managers/user');
jest.mock('../../models/user.accessors');
jest.mock('../../models/meeting.accessors');
const fetch = require('jest-fetch-mock');

jest.setMock('node-fetch', fetch);

const permissionLevels = require('../../../common/auth/permissions');
const { createUser, getPermissionLevel, parseOpenIDUserinfo, deserializeUser } = require('../user');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { addUser } = require('../../managers/user');
const { getUserByUsername, updateUserById, getUserById } = require('../../models/user.accessors');
const { generateGenfors, generateUser, generateOW4OAuth2ResponseBody } = require('../../utils/generateTestData');

describe('permission level parser', () => {
  it('parses userinfo body and returns is logged in permission for non-members', () => {
    const body = generateOW4OAuth2ResponseBody({ member: false });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });

  it('parses userinfo body and returns can vote permission for members', () => {
    const body = generateOW4OAuth2ResponseBody({ member: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for staff', () => {
    const body = generateOW4OAuth2ResponseBody({ member: true, staff: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for superusers', () => {
    const body = generateOW4OAuth2ResponseBody({ member: true, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns is logged in permission for superusers who are not members', () => {
    const body = generateOW4OAuth2ResponseBody({ member: false, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });
});

describe('openid user parser', () => {
  it('parses openid userinfo to some data we can use', () => {
    const userinfo = generateOW4OAuth2ResponseBody(generateUser());
    const expectedUserFields = {
      name: userinfo.name,
      onlinewebId: userinfo.username,
      member: userinfo.member,
      superuser: userinfo.superuser,
    };

    expect(parseOpenIDUserinfo(userinfo)).toEqual(
      expect.objectContaining(expectedUserFields),
    );
  });
});

describe('create user', () => {
  beforeEach(async () => {
    addUser.mockImplementation((name, username, securityLevel) =>
      generateUser({ name, onlinewebId: username, permissions: securityLevel }));
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUserByUsername.mockImplementation(() => generateUser());
  });

  it('creates a regular user if active genfors and user is superuser', async () => {
    getUserByUsername.mockImplementation(() => null);
    const user = await createUser(generateUser({ member: true, superuser: true }));

    expect(user.permissions).toEqual(permissionLevels.CAN_VOTE);
  });

  it('creates a superuser if no active genfors and user is superuser', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    const user = await createUser(generateUser({ member: true, superuser: true }));

    expect(user.permissions).toEqual(permissionLevels.IS_SUPERUSER);
  });

  it('updates an existing user if logging in again', async () => {
    const testUserData = {
      first_name: 'Test',
      last_name: 'User',
      member: false,
      username: 'testuser1',
    };
    const testUserMock = {
      name: `${testUserData.first_name} ${testUserData.last_name}`,
      permissions: permissionLevels.IS_LOGGED_IN,
      onlinewebId: testUserData.username,
    };

    fetch.mockResponse(JSON.stringify(generateOW4OAuth2ResponseBody(testUserData)));
    getUserByUsername.mockImplementation(() =>
      generateUser(testUserMock));
    updateUserById.mockImplementation(() =>
      generateUser(Object.assign(testUserMock, { permissions: permissionLevels.CAN_VOTE })));

    const updatedUser = await createUser(await generateUser());

    expect(updatedUser).toMatchObject({
      name: `${testUserData.first_name} ${testUserData.last_name}`,
      onlinewebId: testUserData.username,
      permissions: permissionLevels.CAN_VOTE,
    });
  });

  it('throws error if no active genfors and no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    await expect(createUser(generateUser())).rejects.toEqual(new Error('No active genfors'));
  });
});


describe('deserialize user', () => {
  it('deserializes to promise that returns user on success', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ id: '4321' }));
    getUserById.mockImplementation(async id => generateUser({ id, meetingId: '4321' }));
    const done = jest.fn();
    const id = '123';

    await deserializeUser(id, done);

    const [error, user] = done.mock.calls[0];
    expect(error).toBeNull();
    await expect(user()).resolves.toEqual(
      expect.objectContaining({ id: '123', meetingId: '4321' }),
    );
  });

  it('returns false if user isn\'t found', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ id: '4321' }));
    getUserById.mockImplementation(async () => null);
    const done = jest.fn();
    const id = '123';

    await deserializeUser(id, done);

    const [error, user, message] = done.mock.calls[0];
    expect(error).toBeNull();
    expect(user).toEqual(false);
    expect(message).toEqual('Unable to find user');
  });

  it('returns false user is not connected to current meeting', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ id: '4321' }));
    getUserById.mockImplementation(async id => generateUser({ id, meetingId: '54321' }));
    const done = jest.fn();
    const id = '123';

    await deserializeUser(id, done);

    const [error, user, message] = done.mock.calls[0];
    expect(error).toBeNull();
    expect(user).toEqual(false);
    expect(message).toEqual('User is not connected to current meeting');
  });
});
