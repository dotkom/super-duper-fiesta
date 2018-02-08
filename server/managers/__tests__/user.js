jest.mock('../../models/meeting.accessors');
jest.mock('../../models/user.accessors');
const { addUser: modelAddUser, updateUserById } = require('../../models/user.accessors');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { addUser, setUserPermissions } = require('../user');
const permissionLevels = require('../../../common/auth/permissions');
const { generateGenfors, generateUser } = require('../../utils/generateTestData');

const userObj = generateUser({
  name: 'Test User',
  onlinewebId: 'testuser1',
  permissions: permissionLevels.CAN_VOTE,
});

describe('addUser manager', () => {
  beforeAll(() => {
    modelAddUser.mockImplementation(data =>
      generateUser({
        name: data.name,
        onlinewebId: data.onlinewebId,
        permissions: data.permissions,
      }));
    getActiveGenfors.mockImplementation(async () => generateGenfors());
  });

  it('adds a new user', async () => {
    expect(await addUser(userObj.name, userObj.onlinewebId, userObj.permissions))
      .toMatchObject(userObj);
  });

  it('doesnt add a new user if no genfors and not superuser', async () => {
    getActiveGenfors.mockImplementation(async () => null);

    await expect(addUser(userObj.name, userObj.onlinewebId, userObj.permissions)).rejects
      .toEqual(new Error('Ingen aktive generalforsamlinger'));
  });

  it('adds a new user if no genfors but user is superuser', async () => {
    getActiveGenfors.mockImplementation(async () => null);

    expect(await addUser(userObj.name, userObj.onlinewebId, permissionLevels.IS_SUPERUSER))
      .toMatchObject(Object.assign(userObj, { permissions: permissionLevels.IS_SUPERUSER }));
  });
});

describe('updating user permissions', () => {
  it('returns updated user object', async () => {
    updateUserById.mockImplementation(async (id, obj) => Object.assign({ id }, obj));
    const updatedUser = await setUserPermissions('id', permissionLevels.CAN_VOTE);

    expect(updatedUser).toMatchObject({ permissions: permissionLevels.CAN_VOTE });
  });
});
