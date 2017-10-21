jest.mock('../../../models/user');
jest.mock('../../../models/meeting');
const fetch = require('jest-fetch-mock');

jest.setMock('node-fetch', fetch);

const { getPermissionLevel, getClientInformation } = require('../ow4');
const permissionLevels = require('../../../../common/auth/permissions');
const { getActiveGenfors } = require('../../../models/meeting');
const { addUser, getUserByUsername, updateUserById } = require('../../../models/user');
const { generateGenfors, generateUser } = require('../../../utils/generateTestData');


function mockOW4OAuth2ResponseBody(data) {
  return Object.assign({
    first_name: 'first name',
    last_name: 'last name',
    username: 'username',
    email: 'test@example.org',
    member: false,
    staff: false,
    superuser: false,
    nickname: 'nickname',
    rfid: '12345678',
    image: '',
    field_of_study: '',
  }, data);
}

describe('permission level parser', () => {
  it('parses userinfo body and returns is logged in permission for non-members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: false });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });

  it('parses userinfo body and returns can vote permission for members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for staff', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true, staff: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for superusers', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns is logged in permission for superusers who are not members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: false, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });
});

describe('ow4 oauth2 provider', async () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(mockOW4OAuth2ResponseBody()));
    addUser.mockImplementation((name, username, securityLevel) =>
      generateUser(name, username, securityLevel));
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUserByUsername.mockImplementation(() => generateUser());
  });

  it('adds a new user with details from ow4', async () => {
    const testUserData = {
      first_name: 'Test',
      last_name: 'User',
      member: true,
      username: 'testuser1',
    };
    fetch.mockResponse(JSON.stringify(mockOW4OAuth2ResponseBody(testUserData)));
    getUserByUsername.mockImplementation(() => null);

    const user = await getClientInformation('');

    expect(user).toMatchObject({
      name: `${testUserData.first_name} ${testUserData.last_name}`,
      onlinewebId: testUserData.username,
      permissions: permissionLevels.CAN_VOTE,
    });
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

    fetch.mockResponse(JSON.stringify(mockOW4OAuth2ResponseBody(testUserData)));
    getUserByUsername.mockImplementation(() =>
      generateUser(testUserMock));
    updateUserById.mockImplementation(() =>
      generateUser(Object.assign(testUserMock, { permissions: permissionLevels.CAN_VOTE })));

    const updatedUser = await getClientInformation();

    expect(updatedUser).toMatchObject({
      name: `${testUserData.first_name} ${testUserData.last_name}`,
      onlinewebId: testUserData.username,
      permissions: permissionLevels.CAN_VOTE,
    });
  });
});
