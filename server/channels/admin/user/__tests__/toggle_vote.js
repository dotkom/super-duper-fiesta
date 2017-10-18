jest.mock('../../../../models/user');
const { toggleCanVote } = require('../toggle_vote');
const { updateUserById } = require('../../../../models/user');
const { generateUser, generateSocket } = require('../../../../utils/generateTestData');

describe('toggleCanVote', () => {
  beforeEach(() => {
    updateUserById.mockImplementation(
      async (userid, data) => generateUser({ id: userid, ...data }));
  });

  const generateData = () => ({
    canVote: false,
  });

  it('emits toggled can vote action on success', async () => {
    const socket = generateSocket();
    await toggleCanVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});
