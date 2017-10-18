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
const { getVotes, haveIVoted } = require('../../models/vote');
const { getActiveQuestion, getConcludedIssues } = require('../../models/issue');
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
    getConcludedIssues.mockImplementation(async meeting => [
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
      generateIssue({ meeting: meeting.id, _id: '2' }),
    ]);
    getVotes.mockImplementation(async ({ _id: issueId }) => [
      generateVote({ question: issueId, _id: '1' }),
      generateVote({ question: issueId, _id: '2' }),
      generateVote({ question: issueId, _id: '3' }),
      generateVote({ question: issueId, _id: '4' }),
    ]);
    haveIVoted.mockImplementation(async () => false);
  });

  it('emits correct actions when signed in and active genfors', async () => {
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when signed in and no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when not signed in and no active genfors', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    await connection(generateSocket({ logged_in: false, completedRegistration: false }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when user has not completed registration and no genfors is active', async () => {
    getActiveGenfors.mockImplementation(async () => null);
    await connection(generateSocket({ completedRegistration: false }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when validation of password hash returns false', async () => {
    getAnonymousUser.mockImplementation(async () => null);
    await connection(generateSocket({ completedRegistration: true }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when validation of password hash returns throws error', async () => {
    getAnonymousUser.mockImplementation(async () => { throw new Error('Failed'); });
    getActiveGenfors.mockImplementation(async () => null);
    await connection(generateSocket({ completedRegistration: false }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when there is no active question', async () => {
    getActiveQuestion.mockImplementation(async () => null);
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving votes fails', async () => {
    getVotes.mockImplementation(async () => { throw new Error('Failed'); });
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when active question is secret', async () => {
    getActiveQuestion.mockImplementation(async () => generateIssue({ secret: true }));
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when user has already voted', async () => {
    haveIVoted.mockImplementation(async () => true);
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving active question fails', async () => {
    getActiveQuestion.mockImplementation(async () => { throw new Error('Failed'); });
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving questions fails', async () => {
    getConcludedIssues.mockImplementation(async () => { throw new Error('Failed'); });
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits correct actions when retrieving active genfors fails', async () => {
    getActiveGenfors.mockImplementation(async () => { throw new Error('Failed'); });
    await connection(generateSocket());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});

describe('connection when no meeting', () => {
  it('warns about no active meeting', async () => {
    await connection(generateSocket({ genfors: null }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});
