jest.mock('child_process');
jest.mock('../../utils');
jest.mock('../../models/meeting');
jest.mock('../../models/issue');
jest.mock('../../models/vote');
jest.mock('../../models/user');
const { broadcast, emit } = require('../../utils');
const { execSync } = require('child_process');

execSync.mockImplementation(() => Buffer.from('fake_git_hash'));
const connection = require('../connection');
const { getActiveGenfors } = require('../../models/meeting');
const { getAnonymousUser } = require('../../models/user');
const { getVotes } = require('../../models/vote');
const { getActiveQuestion, getQuestions } = require('../../models/issue');
const { generateSocket, generateGenfors, generateAnonymousUser, generateIssue, generateVote } = require('../../utils/generateTestData');


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
    getQuestions.mockImplementation(async meeting => [
      generateIssue({ meeting: meeting.id, _id: 2 }),
      generateIssue({ meeting: meeting.id, _id: 2 }),
      generateIssue({ meeting: meeting.id, _id: 2 }),
      generateIssue({ meeting: meeting.id, _id: 2 }),
    ]);
    getVotes.mockImplementation(async ({ _id: issueId }) => [
      generateVote({ question: issueId, _id: 1 }),
      generateVote({ question: issueId, _id: 2 }),
      generateVote({ question: issueId, _id: 3 }),
      generateVote({ question: issueId, _id: 4 }),
    ]);
  });

  it('emits correct actions when signed in and active genfors', async () => {
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});
