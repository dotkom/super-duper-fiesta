const { calculateWinner, countVoteAlternatives } = require('../issue');
const { generateIssue, generateVote, generateAlternative } = require('../../utils/generateTestData');
const { RESOLUTION_TYPES } = require('../../../common/actionTypes/voting');

const generateVotingData = (voteCounts) => {
  const alternatives = Object.keys(voteCounts).map(
    name => generateAlternative({
      id: name, text: name,
    }),
  );

  const votes = Object.keys(voteCounts)
    // { Ja: 1, Nei: 2 } -> [JaId, NeiId, NeiId]
    .reduce((acc, name) => (
      [...acc, ...Array(voteCounts[name]).fill(name)]
    ), [])
    // [JaId, NeiId, NeiId] -> { '0': voteForJa, '1': voteForNei, '2': voteForNei }
    .reduce((acc, alternativeId, id) => ({
      ...acc,
      [id]: generateVote({ id: id.toString(), alternative: alternativeId }),
    }), {});

  return [alternatives, votes];
};

describe('calculateWinner', () => {
  it('finds winner with regular vote demand', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 3,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('Ja');
  });

  it('does not find a winner when vote demand is not met', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 3,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('does not find a winner when an alternative has exactly 1/2 of votes with regular vote demand', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 2,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('does not find a winner when an alternative has exactly 2/3 of votes with qualified vote demand', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 4,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('finds a winner when an alternative has above 2/3 of votes with qualified vote demand', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 5,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('Ja');
  });

  it('ignores blank votes when countingBlankVotes is false', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 2,
      Ja: 3,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: false,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('Ja');
  });

  it('counts blank votes when countingBlankVotes is true', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 2,
      Ja: 3,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: true,
    });
    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('counts blank votes when countingBlankVotes is true, but still finds winner', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 2,
      Ja: 5,
      Nei: 2,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: true,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('Ja');
  });

  it('handles multiple choice', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 2,
      'Person 1': 4,
      'Person 2': 1,
      'Person 3': 6,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: false,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('Person 3');
  });

  it('does not count "no" as a winner when using boolean alternatives', () => {
    const [alternatives, votes] = generateVotingData({
      Blank: 0,
      Ja: 3,
      Nei: 4,
    });
    const issue = generateIssue({
      alternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: false,
    });

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });
});
