jest.mock('../../models/issue');
jest.mock('../../models/meeting');
jest.mock('../../models/user');
jest.mock('../../models/vote');
const { createIssue, closeIssue, adminDeleteIssue } = require('../issue');
const { addIssue, endIssue, deleteIssue, getActiveQuestion } = require('../../models/issue');
const { getActiveGenfors, getGenfors } = require('../../models/meeting');
const { getQualifiedUsers } = require('../../models/user');
const { getVotes } = require('../../models/vote');
const { generateSocket, generateIssue, generateGenfors, generateUser, generateVote } = require('../../utils/generateTestData');
const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../../common/actionTypes/issues');

beforeEach(() => {
  addIssue.mockImplementation(async () => generateIssue({ status: VOTING_NOT_STARTED }));
  getActiveQuestion.mockImplementation(async () => null);
  endIssue.mockImplementation(async () => generateIssue());
  getActiveGenfors.mockImplementation(async () => generateGenfors({ id: '1' }));
  getGenfors.mockImplementation(async () => generateGenfors({ id: '1' }));
  getQualifiedUsers.mockImplementation(async () => [
    generateUser({ id: '2' }),
    generateUser({ id: '3' }),
    generateUser({ id: '4' }),
  ]);
  getVotes.mockImplementation(async ({ _id: issueId }) => [
    generateVote({ question: issueId, _id: '1' }),
    generateVote({ question: issueId, _id: '2' }),
    generateVote({ question: issueId, _id: '3' }),
    generateVote({ question: issueId, _id: '4' }),
  ]);
});

describe('createIssue', () => {
  const generateData = () => ({});
  it('emits OPEN_ISSUE action creates issue', async () => {
    const socket = generateSocket();
    await createIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });

  it('emits an error when it fails', async () => {
    addIssue.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await createIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});

describe('closeIssue', () => {
  const generateData = () => ({
    issue: generateIssue(),
  });

  it('emits close issue action and disables voting', async () => {
    endIssue.mockImplementation(async () =>
      generateIssue({ active: false, status: VOTING_FINISHED }));
    const socket = generateSocket({ permissions: 10 });
    await closeIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });

  it('emits error when it fails', async () => {
    endIssue.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await closeIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
    expect(socket.to('admin').emit.mock.calls).toEqual([]);
  });

  it('emits winner when issue only shows winner', async () => {
    endIssue.mockImplementation(async () =>
      generateIssue({ active: false, showOnlyWinner: true, status: VOTING_FINISHED }));
    const socket = generateSocket({ permissions: 10 });
    await closeIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });
});

describe('adminDeleteIssue', () => {
  const generateData = () => ({
    issue: generateIssue(),
  });
  it('emits delete issue on success', async () => {
    deleteIssue.mockImplementation(async () =>
      generateIssue({ active: false, deleted: true, status: VOTING_FINISHED }));

    const socket = generateSocket({ permissions: 10 });
    await adminDeleteIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});
