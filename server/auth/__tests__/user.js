jest.mock('../../managers/user');
jest.mock('../../models/user.accessors');
jest.mock('../../models/meeting.accessors');
const fetch = require('jest-fetch-mock');

jest.setMock('node-fetch', fetch);

const permissionLevels = require('../../../common/auth/permissions');
const { createUser, getPermissionLevel, parseOpenIDUserinfo } = require('../user');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { addUser } = require('../../managers/user');
const { getUserByUsername } = require('../../models/user.accessors');
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

  it('throws error if no active genfors and no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    await expect(createUser(generateUser())).rejects.toEqual(new Error('No active genfors'));
  });
});
