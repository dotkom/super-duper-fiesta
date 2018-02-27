jest.mock('../../../../managers/meeting');
jest.mock('../../../../models/meeting.accessors');
jest.mock('../../../../models/user.accessors');
const { listener, adminSetPermissions, toggleCanVote } = require('../toggle_vote');
const { canEdit } = require('../../../../managers/meeting');
const { getActiveGenfors, getGenfors } = require('../../../../models/meeting.accessors');
const { getUserById, updateUserById } = require('../../../../models/user.accessors');
const { generateGenfors, generateManager, generateUser, generateSocket } = require('../../../../utils/generateTestData');
const permissions = require('../../../../../common/auth/permissions');
const { ADMIN_SET_PERMISSIONS, ADMIN_TOGGLE_CAN_VOTE } = require('../../../../../common/actionTypes/users');

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


function generateSocketData(data) {
  return { type: '', ...data };
}

describe('listener', () => {
  beforeEach(() => {
    // Why tho
    canEdit.mockImplementation((required, user) => user.permissions >= required);
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getGenfors.mockImplementation(async () => generateGenfors());
    updateUserById.mockImplementation(
      async (userid, data) => generateUser({ id: userid, ...data }));
    getUserById.mockImplementation(async userid => generateUser({
      id: userid,
      permissions: permissions.CAN_VOTE,
    }));
  });

  it('listens to ADMIN_SET_PERMISSIONS', async (done) => {
    const socket = generateSocket(generateManager());
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_SET_PERMISSIONS }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to ADMIN_TOGGLE_CAN_VOTE', async (done) => {
    const socket = generateSocket(generateManager());
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_TOGGLE_CAN_VOTE }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('ignores INVALID_ACTION', async () => {
    const socket = generateSocket();
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: 'INVALID_ACTION' }));

    expect(socket.emit).not.toBeCalled();
    expect(socket.broadcast.emit).not.toBeCalled();
  });
});
