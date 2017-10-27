jest.mock('../../models/user');
jest.mock('../../models/vote');
jest.mock('../../models/issue');
jest.mock('../../models/meeting');
const { submitRegularVote, submitAnonymousVote } = require('../vote');
const { haveIVoted, createVote } = require('../../models/vote');
const { getIssueById } = require('../../models/issue');
const { getActiveGenfors, getGenfors } = require('../../models/meeting');
const { getAnonymousUser } = require('../../models/user');
const { generateIssue, generateVote, generateSocket } = require('../../utils/generateTestData');
const { CAN_VOTE, IS_LOGGED_IN } = require('../../../common/auth/permissions');

beforeEach(() => {
  getIssueById.mockImplementation(async () => generateIssue());
  haveIVoted.mockImplementation(async () => false);
  createVote.mockImplementation((user, question, alternative) => ({
    save: async () => generateVote({ user, question, alternative }),
  }));
  getActiveGenfors.mockImplementation(async () => ({
    id: '1',
  }));
  getGenfors.mockImplementation(async id => ({
    id,
  }));
  getAnonymousUser.mockImplementation(async () => ({
    _id: '1',
  }));
});

const generateData = data => ({
  issue: '1',
  alternative: '1',
  ...data,
});


describe('submitRegularVote', () => {
  it('emits error when not registered', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when not registered', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await submitRegularVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits vote', async () => {
    const socket = generateSocket({ completedRegistration: true });
    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts vote', async () => {
    const socket = generateSocket({ completedRegistration: true });
    await submitRegularVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });

  it('emits error with insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: IS_LOGGED_IN });
    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when voting with insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: IS_LOGGED_IN });
    await submitRegularVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote with canVote false', async () => {
    const socket = generateSocket({
      completedRegistration: true,
      permissions: CAN_VOTE,
      canVote: false,
    });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote on inactive issue', async () => {
    getIssueById.mockImplementation(async () => generateIssue({ active: false }));
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote twice', async () => {
    haveIVoted.mockImplementation(async () => true);
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when issue fetching fails', async () => {
    getIssueById.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote on non-existing alternative', async () => {
    const socket = generateSocket({
      completedRegistration: true,
    });

    await submitRegularVote(socket, generateData({ alternative: '-1' }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});

describe('submitAnonymousVote', () => {
  it('emits error when not registered', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when not registered', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await submitAnonymousVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error with insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: IS_LOGGED_IN });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: IS_LOGGED_IN });
    await submitAnonymousVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });


  it('emits vote', async () => {
    const socket = generateSocket({ completedRegistration: true });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });


  it('emits error when trying to vote with canVote false', async () => {
    const socket = generateSocket({
      completedRegistration: true,
      permissions: CAN_VOTE,
      canVote: false,
    });

    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
