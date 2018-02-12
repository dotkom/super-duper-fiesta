jest.mock('../meeting');
jest.mock('../../models/issue.accessors');
jest.mock('../../models/meeting.accessors');
const { getActiveGenfors } = require('../../models/meeting.accessors');
const { canEdit } = require('../meeting');
const { getActiveQuestion, updateIssue } = require('../../models/issue.accessors');
const { disableVoting, enableVoting } = require('../issue');
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
