jest.mock('../../../../models/user');
const { toggleCanVote } = require('../toggle_vote');
const { getUserById, updateUserById } = require('../../../../models/user');
const { generateUser, generateSocket } = require('../../../../utils/generateTestData');
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
