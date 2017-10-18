jest.mock('../../models/user');
jest.mock('../../models/vote');
jest.mock('../../models/issue');
jest.mock('../../models/meeting');
const { submitRegularVote, submitAnonymousVote } = require('../vote');
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
getAnonymousUser.mockImplementation(async () => ({
  _id: '1',
}));

const generateData = () => ({
  issue: '1',
  alternative: '1',
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
    const socket = generateSocket({ completedRegistration: true, permissions: 0 });
    await submitRegularVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when voting with insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: 0 });
    await submitRegularVote(socket, generateData());

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
    const socket = generateSocket({ completedRegistration: true, permissions: 0 });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });

  it('broadcasts nothing when insufficient permissions', async () => {
    const socket = generateSocket({ completedRegistration: true, permissions: 0 });
    await submitAnonymousVote(socket, generateData());

    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });


  it('emits vote', async () => {
    const socket = generateSocket({ completedRegistration: true });
    await submitAnonymousVote(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
  });
});
