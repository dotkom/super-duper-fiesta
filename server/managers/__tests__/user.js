jest.mock('../../models/user');
const { updateUserById } = require('../../models/user');
const { setUserPermissions } = require('../user');
const permissionLevels = require('../../../common/auth/permissions');

describe('updating user permissions', () => {
  it('returns updated user object', async () => {
    updateUserById.mockImplementation(async (id, obj) => Object.assign({ _id: id }, obj));
    const updatedUser = await setUserPermissions('id', permissionLevels.CAN_VOTE);

    expect(updatedUser).toMatchObject({ permissions: permissionLevels.CAN_VOTE });
  });
});
