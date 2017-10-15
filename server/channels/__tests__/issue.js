jest.mock('../../models/issue');
jest.mock('../../models/meeting');
jest.mock('../../models/user');
jest.mock('../../models/vote');
jest.mock('../../utils');
const { createIssue, closeIssue, adminDeleteIssue } = require('../issue');
const { addIssue, endIssue, deleteIssue, getActiveQuestion } = require('../../models/issue');
const { getActiveGenfors, getGenfors } = require('../../models/meeting');
const { getQualifiedUsers } = require('../../models/user');
const { getVotes } = require('../../models/vote');
const { emit, broadcast } = require('../../utils');
const { generateSocket, generateIssue, generateGenfors, generateUser, generateVote } = require('../../utils/generateTestData');

beforeEach(() => {
  addIssue.mockImplementation(async () => generateIssue());
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
    await createIssue(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toMatchSnapshot();
  });

  it('emits an error when it fails', async () => {
    addIssue.mockImplementation(async () => { throw new Error('Failed'); });
    await createIssue(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});

describe('closeIssue', () => {
  const generateData = () => ({
    issue: generateIssue(),
  });

  it('emits close issue action and disables voting', async () => {
    endIssue.mockImplementation(async () => generateIssue({ active: false }));
    await closeIssue(generateSocket({ permissions: 10 }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toMatchSnapshot();
  });

  it('emits error when it fails', async () => {
    endIssue.mockImplementation(async () => { throw new Error('Failed'); });
    await closeIssue(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});

describe('adminDeleteIssue', () => {
  const generateData = () => ({
    issue: generateIssue(),
  });
  it('emits delete issue on success', async () => {
    deleteIssue.mockImplementation(async () => generateIssue({ active: false, deleted: true }));

    await adminDeleteIssue(generateSocket({ permissions: 10 }), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toMatchSnapshot();
  });
});
