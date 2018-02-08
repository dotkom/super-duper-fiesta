jest.mock('../../../../managers/meeting');
jest.mock('../../../../models/meeting.accessors');
jest.mock('../../../../models/user.accessors');
const { adminSetPermissions, toggleCanVote } = require('../toggle_vote');
const { canEdit } = require('../../../../managers/meeting');
const { getActiveGenfors, getGenfors } = require('../../../../models/meeting.accessors');
const { getUserById, updateUserById } = require('../../../../models/user.accessors');
const { generateGenfors, generateManager, generateUser, generateSocket } = require('../../../../utils/generateTestData');
const permissions = require('../../../../../common/auth/permissions');

describe('toggleCanVote', () => {
  beforeEach(() => {
    updateUserById.mockImplementation(
      async (userid, data) => generateUser({ id: userid, ...data }));
    getUserById.mockImplementation(async userid => generateUser({
      id: userid,
      permissions: permissions.CAN_VOTE,
    }));
  });

  const generateData = () => ({
    id: 1,
    canVote: false,
  });

  it('emits toggled can vote action on success', async () => {
    const socket = generateSocket();
    await toggleCanVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });

  it('emits error when user does not have CAN_VOTE permission', async () => {
    getUserById.mockImplementation(async userid => generateUser({
      id: userid,
      permissions: permissions.IS_LOGGED_IN,
    }));
    const socket = generateSocket();

    await toggleCanVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});

describe('setUserPermissions', () => {
  beforeEach(() => {
    const genfors = generateGenfors();
    updateUserById.mockImplementation(
      async (userid, data) => generateUser({ id: userid, ...data }));
    getActiveGenfors.mockImplementation(() => genfors);
    getGenfors.mockImplementation(() => genfors);
    getUserById.mockImplementation(async userid => generateUser({
      id: userid,
      permissions: permissions.IS_LOGGED_IN,
    }));
    canEdit.mockImplementation((required, user) => user.permissions >= required);
  });

  const generateData = () => ({
    id: 1,
    canVote: true,
    permissions: permissions.CAN_VOTE,
  });

  it('updates user permissions if requested and user authorized', async () => {
    const socket = generateSocket(generateManager());

    await adminSetPermissions(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });

  it('does not update user permissions if not authorized', async () => {
    const socket = generateSocket(generateUser());

    await adminSetPermissions(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when failing to update user permissions', async () => {
    updateUserById.mockImplementation(() => { throw new Error(); });
    const socket = generateSocket(generateManager());

    await adminSetPermissions(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
