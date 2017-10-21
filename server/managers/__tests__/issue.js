const { calculateWinner, countVoteAlternatives } = require('../issue');
const { generateIssue, generateVote, generateAlternative } = require('../../utils/generateTestData');
const { RESOLUTION_TYPES } = require('../../../common/actionTypes/voting');

/*
  Turns array of alternative ids into votes object
  ['2', '3'] ->
  {
    0: { _id: 0, alterantive: '2' }
    1: { _id: 1, alterantive: '3' }
  }
*/
const createVotesObject = voteArray => (
  voteArray.reduce((acc, alternativeId, id) => ({
    ...acc,
    [id]: generateVote({ _id: id.toString(), alternative: alternativeId }),
  }), {})
);

describe('calculateWinner', () => {
  const booleanAlternatives = [
    generateAlternative({ id: '1', text: 'Blank' }),
    generateAlternative({ id: '2', text: 'Yes' }),
    generateAlternative({ id: '3', text: 'No' }),
  ];

  const multipleChoiceAlternatives = [
    generateAlternative({ id: '1', text: 'Blank' }),
    generateAlternative({ id: '2', text: 'Person 1' }),
    generateAlternative({ id: '3', text: 'Person 2' }),
    generateAlternative({ id: '4', text: 'Person 3' }),
  ];

  it('finds winner with regular vote demand', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
    });
    const votes = createVotesObject(['2', '2', '2', '3', '3']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('2');
  });

  it('does not find a winner when vote demand is not met', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });
    const votes = createVotesObject(['2', '2', '2', '3', '3']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('does not find a winner when an alternative has exactly 1/2 of votes with regular vote demand', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
    });
    const votes = createVotesObject(['2', '2', '3', '3']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('does not find a winner when an alternative has exactly 2/3 of votes with qualified vote demand', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });
    const votes = createVotesObject(['2', '2', '2', '2', '3', '3']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('finds a winner when an alternative has above 2/3 of votes with qualified vote demand', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.qualified.key,
    });
    const votes = createVotesObject(['2', '2', '2', '2', '2', '3', '3']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('2');
  });

  it('ignores blank votes when countingBlankVotes is false', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: false,
    });
    const votes = createVotesObject(['2', '2', '2', '3', '3', '1', '1']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('2');
  });

  it('counts blank votes when countingBlankVotes is true', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: true,
    });
    const votes = createVotesObject(['2', '2', '2', '3', '3', '1', '1']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual(null);
  });

  it('counts blank votes when countingBlankVotes is true, but still finds winner', () => {
    const issue = generateIssue({
      alternatives: booleanAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: true,
    });
    const votes = createVotesObject(['2', '2', '2', '2', '2', '3', '3', '1', '1']);

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('2');
  });

  it('handles multiple choice', () => {
    const issue = generateIssue({
      alternatives: multipleChoiceAlternatives,
      voteDemand: RESOLUTION_TYPES.regular.key,
      countingBlankVotes: false,
    });
    const votes = createVotesObject(
      ['2', '2', '2', '2', '3', '1', '1', '4', '4', '4', '4', '4', '4'],
    );

    const winner = calculateWinner(issue, votes,
      countVoteAlternatives(issue.alternatives, votes),
    );

    expect(winner).toEqual('4');
  });
});
