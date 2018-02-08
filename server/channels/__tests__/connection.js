jest.mock('child_process');
jest.mock('../../models/meeting.accessors');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/vote.accessors');
jest.mock('../../models/user.accessors');
const { execSync } = require('child_process');

execSync.mockImplementation(() => Buffer.from('fake_git_hash'));
const connection = require('../connection');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { getAnonymousUser, getUsers } = require('../../models/user.accessors');
const { getVotes, getUserVote } = require('../../models/vote.accessors');
const { getActiveQuestion, getConcludedIssues } = require('../../models/issue.accessors');
const { generateSocket, generateGenfors, generateAnonymousUser, generateIssue, generateVote, generateUser } = require('../../utils/generateTestData');
const permissionLevels = require('../../../common/auth/permissions');

describe('connection', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getAnonymousUser.mockImplementation(
      async (passwordHash, onlinewebId, genfors) => generateAnonymousUser({
        passwordHash,
        genfors,
      },
    ));
    getActiveQuestion.mockImplementation(async () => generateIssue());
    getConcludedIssues.mockImplementation(async meeting => [
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
    ]);
    getVotes.mockImplementation(async ({ _id: issueId }) => [
      generateVote({ question: issueId, _id: '1' }),
      generateVote({ question: issueId, _id: '2' }),
      generateVote({ question: issueId, _id: '3' }),
      generateVote({ question: issueId, _id: '4' }),
    ]);
    getUserVote.mockImplementation(
      async () => null,
    );
    getUsers.mockImplementation(async () => [generateUser()]);
  });

  it('emits correct actions when signed in and active genfors', async () => {
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when signed in and no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when user has not completed registration and no genfors is active', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    const socket = generateSocket({ completedRegistration: false });
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when validation of password hash returns false', async () => {
    getAnonymousUser.mockImplementation(async () => null);
    const socket = generateSocket({ completedRegistration: true });
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when validation of password hash returns throws error', async () => {
    getAnonymousUser.mockImplementation(async () => { throw new Error('Failed'); });
    getActiveGenfors.mockImplementation(async () => null);
    const socket = generateSocket({ completedRegistration: false });
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when there is no active question', async () => {
    getActiveQuestion.mockImplementation(async () => null);
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving votes fails', async () => {
    getVotes.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when active question is secret', async () => {
    getActiveQuestion.mockImplementation(async () => generateIssue({ secret: true }));
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when user has already voted', async () => {
    getUserVote.mockImplementation(
      async (question, user) => generateVote({ question: question.id, user }),
    );
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving active question fails', async () => {
    getActiveQuestion.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving questions fails', async () => {
    getConcludedIssues.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits sensitive data like meeting pin if user is manager', async () => {
    const socket = generateSocket({ permissions: permissionLevels.IS_MANAGER });
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving active genfors fails', async () => {
    getActiveGenfors.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});

describe('connection when no meeting', () => {
  it('warns about no active meeting', async () => {
    const socket = generateSocket({ genfors: null });
    await connection(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
