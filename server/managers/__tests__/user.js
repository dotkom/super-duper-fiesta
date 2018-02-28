jest.mock('../../models/meeting.accessors');
jest.mock('../../models/user.accessors');
const { addUser: modelAddUser, getAnonymousUser, getUserByUsername, updateUserById } = require('../../models/user.accessors');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { addAnonymousUser, addUser, setUserPermissions } = require('../user');
const permissionLevels = require('../../../common/auth/permissions');
const { generateGenfors, generateAnonymousUser, generateUser } = require('../../utils/generateTestData');

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

  it('throws error if failing to create user', async () => {
    modelAddUser.mockImplementation(async () => { throw new Error(); });

    const user = addUser(generateUser());

    await expect(user).rejects.toEqual(new Error());
  });
});

describe('addAnonymousUser', () => {
  it('throws error if trying to create new anonUser when user is already registered', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUserByUsername.mockImplementation(async () => generateUser({ completedRegistration: true }));

    const anonUser = addAnonymousUser(generateAnonymousUser());

    await expect(anonUser).rejects.toEqual(new Error('User is already registered'));
  });

  it('throws error if anonUser already exists', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUserByUsername.mockImplementation(async () => generateUser({ completedRegistration: false }));
    getAnonymousUser.mockImplementation(async () => generateAnonymousUser());

    const anonUser = addAnonymousUser(generateAnonymousUser());

    await expect(anonUser).rejects.toEqual(new Error('Anonymous user aleady exists'));
  });
});

describe('updating user permissions', () => {
  it('returns updated user object', async () => {
    updateUserById.mockImplementation(async (id, obj) => Object.assign({ id }, obj));
    const updatedUser = await setUserPermissions('id', permissionLevels.CAN_VOTE);

    expect(updatedUser).toMatchObject({ permissions: permissionLevels.CAN_VOTE });
  });
});
