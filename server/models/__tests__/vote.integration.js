const {
  getUserVote, getVotes, haveIVoted,
} = require('../vote.accessors');

const { generateAlternative, generateIssue, generateMeeting, generateUser, generateVote } = require('../../utils/integrationTestUtils');

describe('vote', () => {
  it('creates a vote', async () => {
    const vote = await generateVote();

    expect(vote).toEqual(expect.objectContaining({
      id: vote.id,
    }));
  });

  it('gets a vote for a user', async () => {
    const meeting = await generateMeeting();
    const user = await generateUser({ meeting });
    const issue = await generateIssue({ meeting });
    const alternative = await generateAlternative();

    const vote = await generateVote({
      user: user.id,
      question: issue.id,
      alternative: alternative.id,
    });

    const userVote = await getUserVote(issue.id, user.id);

    expect(userVote).toEqual(expect.objectContaining({
      id: vote.id,
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

    const votes = await getVotes(issue.id);

    expect(votes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: vote1.id,
      }),
    ]));

    expect(votes).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: vote2.id,
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
