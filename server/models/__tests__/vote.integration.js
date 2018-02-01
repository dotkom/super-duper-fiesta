const databaseSetup = require('../essentials');
const {
  getUserVote, getVotes, haveIVoted,
} = require('../vote');

const { generateIssue, generateMeeting, generateUser, generateVote } = require('../../utils/integrationTestUtils');

describe('vote', () => {
  beforeAll(async () => {
    await databaseSetup();
  });

  it('creates a vote', async () => {
    const vote = await generateVote({});

    expect(vote).toEqual(expect.objectContaining({
      _id: vote._id,
    }));
  });

  it('gets a vote for a user', async () => {
    const meeting = await generateMeeting();
    const user = await generateUser({ genfors: meeting });
    const issue = await generateIssue({ genfors: meeting,
      alternatives: [
        { text: 'one' },
      ],
    });
    const vote = await generateVote({
      user: user._id,
      question: issue,
      alternative: issue.alternatives[0]._id,
    });

    const userVote = await getUserVote(issue._id, user._id);

    expect(userVote).toEqual(expect.objectContaining({
      _id: vote._id,
    }));
  });

  it('gets all votes for a question', async () => {
    const issue = await generateIssue({ alternatives: [{ text: 'one' }] });
    const vote1 = await generateVote({
      question: issue,
    });
    const vote2 = await generateVote({
      question: await generateIssue({ alternatives: [{ text: 'two' }] }),
    });

    const votes = await getVotes(issue._id);

    expect(votes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        _id: vote1._id,
      }),
    ]));

    expect(votes).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        _id: vote2._id,
      }),
    ]));
  });

  it('gets voted status for a not voted on question', async () => {
    const issue = await generateIssue();
    const user = await generateUser();

    expect(await haveIVoted(issue, user)).toEqual(false);
  });

  it('gets voted status for a voted on question', async () => {
    const issue = await generateIssue({ alternatives: [{ text: 'one' }] });
    const user = await generateUser();
    await generateVote({
      user,
      question: issue,
    });

    expect(await haveIVoted(issue, user)).toEqual(true);
  });
});
