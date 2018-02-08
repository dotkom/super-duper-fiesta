jest.mock('../../models/issue.accessors');
jest.mock('../../models/vote.accessors');
jest.mock('../meeting');
const { canEdit } = require('../meeting');
const { getIssueWithAlternatives } = require('../../models/issue.accessors');
const { createVote } = require('../../models/vote.accessors');

const { addVote } = require('../vote');
const { generateAlternative, generateIssue, generateUser, generateVote } = require('../../utils/generateTestData');
const { VOTING_NOT_STARTED, VOTING_FINISHED }
  = require('../../../common/actionTypes/issues');

describe('addVote', () => {
  beforeEach(() => {
    createVote.mockImplementation(async data => generateVote(data));
    canEdit.mockImplementation((securityLevel, user) => user.permissions >= securityLevel);
    getIssueWithAlternatives.mockImplementation(async () => generateIssue());
  });

  it('adds a vote if all requirements pass', async () => {
    const alternative = generateAlternative({ id: '1' });
    const user = generateUser();
    const vote = await addVote('', user, alternative.id, user.id);

    await expect(vote).toEqual(expect.objectContaining({
      id: vote.id,
    }));
  });

  it('throws error if voting state is NOT_STARTED', async () => {
    getIssueWithAlternatives.mockImplementation(async () =>
      generateIssue({ status: VOTING_NOT_STARTED }));

    const alternative = generateAlternative();
    const user = generateUser();
    const vote = addVote('', user, alternative.id, user.id);

    await expect(vote).rejects.toEqual(new Error('Votering for denne saken har ikke startet enda.'));
  });

  it('throws error if voting state is VOTING_FINISHED', async () => {
    getIssueWithAlternatives.mockImplementation(async () =>
      generateIssue({ status: VOTING_FINISHED }));

    const alternative = generateAlternative();
    const user = generateUser();
    const vote = addVote('', user, alternative.id, user.id);

    await expect(vote).rejects.toEqual(new Error('Votering for denne saken har blitt avsluttet.'));
  });
});
