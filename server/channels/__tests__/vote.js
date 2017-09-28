jest.mock('../../models/user');
jest.mock('../../models/vote');
jest.mock('../../models/issue');
jest.mock('../../models/meeting');
jest.mock('../../utils');
const { submitRegularVote } = require('../vote');
const { emit } = require('../../utils');
const { haveIVoted, createVote } = require('../../models/vote');
const { getIssueById } = require('../../models/issue');
const { getActiveGenfors, getGenfors } = require('../../models/meeting');

const generateIssue = (issueId = 1) => ({
  _id: issueId,
  active: true,
  genfors: '1',
});

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


getIssueById.mockImplementation(async () => generateIssue());
haveIVoted.mockImplementation(async () => false);
createVote.mockImplementation(() => ({
  save: async () => jest.fn(),
}));
getActiveGenfors.mockImplementation(async () => ({
  id: '1',
}));
getGenfors.mockImplementation(async id => ({
  id,
}));

describe('submitRegularVote', () => {
  it('returns error when not registered', async () => {
    await submitRegularVote(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });
  it('emits vote', async () => {
    await submitRegularVote(generateSocket({ completedRegistration: true }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });
});
