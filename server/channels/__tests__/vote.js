jest.mock('../../models/user.accessors');
jest.mock('../../models/vote.accessors');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/meeting.accessors');
const { listener, submitRegularVote, submitAnonymousVote } = require('../vote');
const { createUserVote, createAnonymousVote, getUserVote } = require('../../models/vote.accessors');
const { getIssueById, getIssueWithAlternatives } = require('../../models/issue.accessors');
const { getActiveGenfors, getGenfors } = require('../../models/meeting.accessors');
const { getAnonymousUser } = require('../../models/user.accessors');
const { generateIssue, generateVote, generateSocket, generateAnonymousUser } = require('../../utils/generateTestData');
const { CAN_VOTE, IS_LOGGED_IN } = require('../../../common/auth/permissions');
const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../../common/actionTypes/issues');
const { SUBMIT_ANONYMOUS_VOTE, SUBMIT_REGULAR_VOTE } = require('../../../common/actionTypes/voting');

beforeEach(() => {
  getIssueById.mockImplementation(async () => generateIssue());
  getIssueWithAlternatives.mockImplementation(async () => generateIssue());
  getUserVote.mockImplementation(async () => null);
  createUserVote.mockImplementation((userId, issueId, alternativeId) =>
    generateVote({ userId, issueId, alternativeId }),
  );
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
    getIssueWithAlternatives.mockImplementation(() => issue);
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when tring to vote on issue when voting has ended', async () => {
    const issue = generateIssue({ status: VOTING_FINISHED });
    getIssueWithAlternatives.mockImplementation(() => issue);
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote on inactive issue', async () => {
    getIssueWithAlternatives.mockImplementation(async () => generateIssue({ active: false }));
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when trying to vote twice', async () => {
    getUserVote.mockImplementation(async () => generateVote());
    const socket = generateSocket({ completedRegistration: true });

    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when issue fetching fails', async () => {
    getIssueWithAlternatives.mockImplementation(async () => { throw new Error('Failed'); });
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
  beforeEach(() => {
    getIssueById.mockImplementation(async id => generateIssue({ id, secret: true }));
    createAnonymousVote.mockImplementation((userId, issueId, alternativeId) =>
      generateVote({ userId, issueId, alternativeId }),
    );
    getAnonymousUser.mockImplementation(async (passwordHash, onlinewebId, meetingId) =>
      generateAnonymousUser({ passwordHash, meetingId }),
    );
  });
  it('emits error when not registered', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('emits error with wrong passwordHash', async () => {
    getAnonymousUser.mockImplementation(async () => null);
    const socket = generateSocket();
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

function generateSocketData(data) {
  return {
    type: '',
    ...data,
  };
}

describe('listener', () => {
  it('listens to SUBMIT_ANONYMOUS_VOTE', async (done) => {
    const socket = generateSocket({ permissions: CAN_VOTE });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: SUBMIT_ANONYMOUS_VOTE, ...generateData() }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to SUBMIT_REGULAR_VOTE', async (done) => {
    const socket = generateSocket({ permissions: CAN_VOTE });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: SUBMIT_REGULAR_VOTE, ...generateData() }));

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
