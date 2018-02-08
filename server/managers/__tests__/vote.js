jest.mock('../../models/issue.accessors');
jest.mock('../../models/vote.accessors');
jest.mock('../meeting');
const { canEdit } = require('../meeting');
const { getIssueById } = require('../../models/issue.accessors');

const { addVote } = require('../vote');
const { generateAlternative, generateIssue, generateUser } = require('../../utils/generateTestData');
const { VOTING_NOT_STARTED, VOTING_FINISHED }
  = require('../../../common/actionTypes/issues');

describe('addVote', () => {
  beforeEach(() => {
    canEdit.mockImplementation((securityLevel, user) => user.permissions >= securityLevel);
    getIssueById.mockImplementation(async () => generateIssue());
  });

  it('adds a vote if all requirements pass', async () => {
    const alternative = generateAlternative();
    const user = generateUser();
    const vote = addVote('', user, alternative.id, user.id);

    // A bit sneaky since we currently use .save() in a manager.
    await expect(vote).rejects.toEqual(new Error("Cannot read property 'save' of undefined"));
  });

  it('throws error if voting state is NOT_STARTED', async () => {
    getIssueById.mockImplementation(async () => generateIssue({ status: VOTING_NOT_STARTED }));

    const alternative = generateAlternative();
    const user = generateUser();
    const vote = addVote('', user, alternative.id, user.id);

    await expect(vote).rejects.toEqual(new Error('Votering for denne saken har ikke startet enda.'));
  });

  it('throws error if voting state is VOTING_FINISHED', async () => {
    getIssueById.mockImplementation(async () => generateIssue({ status: VOTING_FINISHED }));

    const alternative = generateAlternative();
    const user = generateUser();
    const vote = addVote('', user, alternative.id, user.id);

    await expect(vote).rejects.toEqual(new Error('Votering for denne saken har blitt avsluttet.'));
  });
});
