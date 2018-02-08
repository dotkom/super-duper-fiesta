jest.mock('../../models/user.accessors');
jest.mock('../../models/vote.accessors');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/meeting.accessors');
const { submitRegularVote, submitAnonymousVote } = require('../vote');
const { haveIVoted, createVote } = require('../../models/vote.accessors');
const { getIssueById } = require('../../models/issue.accessors');
const { getActiveGenfors, getGenfors } = require('../../models/meeting.accessors');
const { getAnonymousUser } = require('../../models/user.accessors');
const { generateIssue, generateVote, generateSocket } = require('../../utils/generateTestData');
const { CAN_VOTE, IS_LOGGED_IN } = require('../../../common/auth/permissions');
const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../../common/actionTypes/issues');

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
    id: '1',
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

  it("emits error when tring to vote on issue when voting hasn't started", async () => {
    const issue = generateIssue({ status: VOTING_NOT_STARTED });
    getIssueById.mockImplementation(() => issue);
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when tring to vote on issue when voting has ended', async () => {
    const issue = generateIssue({ status: VOTING_FINISHED });
    getIssueById.mockImplementation(() => issue);
    const socket = generateSocket({ completedRegistration: true });

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
