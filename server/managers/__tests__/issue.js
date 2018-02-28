jest.mock('../meeting');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/meeting.accessors');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { canEdit } = require('../meeting');
const { getActiveQuestion, updateIssue } = require('../../models/issue.accessors');
const { addIssue, deleteIssue, disableVoting, enableVoting, endIssue } = require('../issue');
const { generateIssue, generateManager, generateUser, generateGenfors }
  = require('../../utils/generateTestData');
const { VOTING_IN_PROGRESS, VOTING_FINISHED }
  = require('../../../common/actionTypes/issues');


describe('enable voting', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    canEdit.mockImplementation((securityLevel, user) => user.permissions >= securityLevel);
    getActiveQuestion.mockImplementation(() => ({ ...generateIssue() }));
    updateIssue.mockImplementation(async (id, data) => generateIssue({ id, ...data }));
  });

  it('sets status of an issue to VOTING_IN_PROGRESS', async () => {
    const issue = await getActiveQuestion();

    const enabledVotingIssue = await enableVoting(issue, generateManager());

    expect(enabledVotingIssue).toMatchObject({ ...issue, status: VOTING_IN_PROGRESS });
  });

  it('throws an error if user does not have permissions to do so', async () => {
    const issue = await getActiveQuestion();

    const updatedIssue = enableVoting(issue, generateUser());

    await expect(updatedIssue).rejects.toEqual(new Error('User is not authorized to enable voting on this issue.'));
  });
});

describe('disable voting', () => {
  beforeEach(() => {
    canEdit.mockImplementation((securityLevel, user) => user.permissions >= securityLevel);
    getActiveQuestion.mockImplementation(async () => generateIssue());
    updateIssue.mockImplementation(async (id, data) => generateIssue({ id, ...data }));
  });

  it('sets status of an issue to VOTING_FINISHED', async () => {
    const issue = await getActiveQuestion();

    const disabledVotingIssue = await disableVoting(issue, generateManager());

    expect(disabledVotingIssue).toMatchObject({ ...issue, status: VOTING_FINISHED });
  });

  it('throws an error if user does not have permissions to do so', async () => {
    const issue = await getActiveQuestion();

    const updatedIssue = disableVoting(issue, generateUser());

    await expect(updatedIssue).rejects.toEqual(new Error('User is not authorized to disable voting on this issue.'));
  });
});

describe('endIssue', () => {
  it("throws error if user doesn't have permission", async () => {
    canEdit.mockImplementation(() => false);
    const issue = await getActiveQuestion();

    const closedIssue = endIssue(issue);

    await expect(closedIssue).rejects.toEqual(new Error('permission denied'));
  });
});

describe('addIssue', () => {
  it('throws error if no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);

    const issue = addIssue(generateIssue());

    await expect(issue).rejects.toEqual(new Error('No genfors active'));
  });

  it('throws error if issue is already active', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getActiveQuestion.mockImplementation(() => generateIssue());

    const issue = addIssue(generateIssue());

    await expect(issue).rejects.toEqual(new Error("There's already an active question"));
  });
});

describe('deleteIssue', () => {
  it('throws error if user is not allowed to delete', async () => {
    canEdit.mockImplementation(async () => false);
    getActiveGenfors.mockImplementation(async () => generateGenfors());

    const deletedIssue = deleteIssue(generateIssue().id);

    await expect(deletedIssue)
      .rejects.toEqual(new Error("You don't have permission to delete this issue"));
  });
});
