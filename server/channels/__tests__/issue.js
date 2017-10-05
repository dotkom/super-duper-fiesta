jest.mock('../../models/issue');
jest.mock('../../utils');
const { createIssue, closeIssue, adminDeleteIssue } = require('../issue');
const { addIssue, endIssue, deleteIssue } = require('../../models/issue');
const { emit, broadcast } = require('../../utils');
const { generateSocket, generateIssue } = require('../../utils/generateTestData');

beforeEach(() => {
  addIssue.mockImplementation(async () => generateIssue());
  endIssue.mockImplementation(async () => generateIssue());
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
    await closeIssue(generateSocket(), generateData());

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

    await adminDeleteIssue(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toMatchSnapshot();
  });
});
