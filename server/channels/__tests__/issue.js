jest.mock('../../models/alternative.accessors');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/meeting.accessors');
jest.mock('../../models/user.accessors');
jest.mock('../../models/vote.accessors');
const { addAlternative } = require('../../models/alternative.accessors');
const { listener, createIssue, closeIssue, adminDeleteIssue, adminDisableVoting, adminEnableVoting } = require('../issue');
const { addIssue, endIssue, deleteIssue, getActiveQuestion, getIssueWithAlternatives, updateIssue } = require('../../models/issue.accessors');
const { getActiveGenfors, getGenfors } = require('../../models/meeting.accessors');
const { getQualifiedUsers } = require('../../models/user.accessors');
const { getVotes } = require('../../models/vote.accessors');
const { generateSocket, generateIssue, generateGenfors, generateUser, generateManager, generateVote, generateAlternative } = require('../../utils/generateTestData');
const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../../common/actionTypes/issues');
const {
  ADMIN_CLOSE_ISSUE,
  ADMIN_CREATE_ISSUE,
  ADMIN_DELETE_ISSUE,
  ADMIN_DISABLE_VOTING,
  ADMIN_ENABLE_VOTING,
} = require('../../../common/actionTypes/adminButtons');

beforeEach(() => {
  addAlternative.mockImplementation(async () => generateAlternative());
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
  getVotes.mockImplementation(async ({ id: issueId }) => [
    generateVote({ issueId, id: '1' }),
    generateVote({ issueId, id: '2' }),
    generateVote({ issueId, id: '3' }),
    generateVote({ issueId, id: '4' }),
  ]);
  getIssueWithAlternatives.mockImplementation(async () =>
    generateIssue({ status: VOTING_NOT_STARTED }));
});

describe('createIssue', () => {
  const generateData = () => generateIssue();
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
    getIssueWithAlternatives.mockImplementation(async () =>
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
    getIssueWithAlternatives.mockImplementation(async () =>
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
    getIssueWithAlternatives.mockImplementation(async () =>
      generateIssue({ active: false, deleted: true, status: VOTING_FINISHED }));

    const socket = generateSocket({ permissions: 10 });
    await adminDeleteIssue(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});

describe('adminDisableVoting', () => {
  beforeEach(() => {
    getActiveQuestion.mockImplementation(() => generateIssue());
    updateIssue.mockImplementation(async (id, data) => generateIssue({ id, ...data }));
  });

  it('emits disable voting on success', async () => {
    const socket = generateSocket(generateManager());

    await adminDisableVoting(socket, { issue: '1' });

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});

describe('adminEnableVoting', () => {
  beforeEach(() => {
    getActiveQuestion.mockImplementation(() => generateIssue());
    updateIssue.mockImplementation(async (id, data) => generateIssue({ id, ...data }));
  });

  it('emits enable voting on success', async () => {
    const socket = generateSocket(generateManager());

    await adminEnableVoting(socket, { issue: '1' });

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});

function generateSocketData(data) {
  return {
    type: ADMIN_CREATE_ISSUE,
    ...data,
  };
}

describe('listener', () => {
  beforeAll(() => {
    addIssue.mockImplementation(async () => generateIssue());
    getIssueWithAlternatives.mockImplementation(async () => generateIssue());
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getGenfors.mockImplementation(async () => generateGenfors());
    getQualifiedUsers.mockImplementation(async () => 0);
    updateIssue.mockImplementation(async (_, data) => generateIssue(data));
  });

  it('listens to ADMIN_CREATE_ISSUE', async (done) => {
    const socket = generateSocket();
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_CREATE_ISSUE, data: generateIssue() }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to ADMIN_CLOSE_ISSUE', async (done) => {
    endIssue.mockImplementation(async data => generateIssue({ ...data, status: VOTING_FINISHED }));
    getVotes.mockImplementation(async ({ id: issueId }) => [
      generateVote({ issueId, id: '1' }),
      generateVote({ issueId, id: '2' }),
      generateVote({ issueId, id: '3' }),
      generateVote({ issueId, id: '4' }),
    ]);
    const socket = generateSocket({ permissions: 10 });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_CLOSE_ISSUE, data: { issue: generateIssue() } }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to ADMIN_DELETE_ISSUE', async (done) => {
    deleteIssue.mockImplementation(async data => generateIssue({ ...data, active: false }));
    getVotes.mockImplementation(async ({ id: issueId }) => [
      generateVote({ issueId, id: '1' }),
      generateVote({ issueId, id: '2' }),
      generateVote({ issueId, id: '3' }),
      generateVote({ issueId, id: '4' }),
    ]);
    const socket = generateSocket({ permissions: 10 });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_DELETE_ISSUE, data: { issue: generateIssue() } }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to ADMIN_DISABLE_VOTING', async (done) => {
    const socket = generateSocket({ permissions: 10 });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_DISABLE_VOTING, data: { issue: generateIssue() } }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to ADMIN_ENABLE_VOTING', async (done) => {
    const socket = generateSocket({ permissions: 10 });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_ENABLE_VOTING, data: { issue: generateIssue() } }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('ignores INVALID_ACTION', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: 'INVALID_ACTION' }));

    expect(socket.emit).not.toBeCalled();
    expect(socket.broadcast.emit).not.toBeCalled();
  });
});
