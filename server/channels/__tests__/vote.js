jest.mock('../../models/user');
jest.mock('../../models/vote');
jest.mock('../../models/issue');
jest.mock('../../models/meeting');
jest.mock('../../utils');
const { submitRegularVote, submitAnonymousVote } = require('../vote');
const { emit, broadcast } = require('../../utils');
const { haveIVoted, createVote } = require('../../models/vote');
const { getIssueById } = require('../../models/issue');
const { getActiveGenfors, getGenfors } = require('../../models/meeting');
const { getAnonymousUser } = require('../../models/user');
const { generateIssue, generateSocket } = require('../../utils/generateTestData');

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
getAnonymousUser.mockImplementation(async (passwordHash, onlinewebId, genfors) => ({
  _id: 1,
}));

const generateData = () => ({
  issue: 1,
  alternative: 1,
});


describe('submitRegularVote', () => {
  it('emits error when not registered', async () => {
    await submitRegularVote(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when not registered', async () => {
    await submitRegularVote(generateSocket(), generateData());

    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits vote', async () => {
    await submitRegularVote(generateSocket({ completedRegistration: true }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts vote', async () => {
    await submitRegularVote(generateSocket({ completedRegistration: true }), generateData());

    expect(broadcast.mock.calls).toMatchSnapshot();
  });

  it('emits error with insufficient permissions', async () => {
    await submitRegularVote(generateSocket(
      { completedRegistration: true, permissions: 0 },
    ), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when voting with insufficient permissions', async () => {
    await submitRegularVote(generateSocket(
      { completedRegistration: true, permissions: 0 },
    ), generateData());

    expect(broadcast.mock.calls).toEqual([]);
  });
});

describe('submitAnonymousVote', () => {
  it('emits error when not registered', async () => {
    await submitAnonymousVote(generateSocket(

    ), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when not registered', async () => {
    await submitAnonymousVote(generateSocket(

    ), generateData());

    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error with insufficient permissions', async () => {
    await submitAnonymousVote(generateSocket(
      { completedRegistration: true, permissions: 0 },
    ), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when insufficient permissions', async () => {
    await submitAnonymousVote(generateSocket(
      { completedRegistration: true, permissions: 0 },
    ), generateData());

    expect(broadcast.mock.calls).toEqual([]);
  });


  it('emits vote', async () => {
    await submitAnonymousVote(generateSocket({ completedRegistration: true }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
  });
});
