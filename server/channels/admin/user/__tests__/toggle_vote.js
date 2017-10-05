jest.mock('../../../../models/user');
jest.mock('../../../../utils');
const { toggleCanVote } = require('../toggle_vote');
const { emit, broadcast } = require('../../../../utils');
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
    await toggleCanVote(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toMatchSnapshot();
  });
});
