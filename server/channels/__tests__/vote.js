jest.mock('../../models/user');
jest.mock('../../models/vote', () => ({
  haveIVoted: async () => false,
  createVote: () => ({
    save: async () => jest.fn(),
  }),
}));
jest.mock('../../models/issue', () => ({
  getIssueById: async issueId => ({
    _id: issueId,
    active: true,
    genfors: '1',
  }),
}));
jest.mock('../../models/meeting', () => ({
  getActiveGenfors: async () => ({
    id: '1',
  }),
  getGenfors: async id => ({
    id,
  }),
}));
jest.mock('../../utils');
const { submitRegularVote } = require('../vote');
const { broadcast, emit } = require('../../utils');

const generateSocket = user => ({
  request: {
    user: {
      _id: '123',
      onlinewebId: '123',
      name: 'Namy',
      completedRegistration: false,
      permissions: 5,
      genfors: '1',
      ...user,
    },
    headers: {
      cookie: {
        passwordHash: 'hashy',
      },
    },
  },
});

const generateData = () => ({
  issue: 1,
  alternative: 1,
});

describe('submitRegularVote', () => {
  it('returns error when not registered', async () => {
    await submitRegularVote(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });
  it('does something', async () => {
    await submitRegularVote(generateSocket({ completedRegistration: true }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });
});
