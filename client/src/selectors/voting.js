import { createSelector } from 'reselect';
import { getIssue } from './issues';
import { usersSelector } from './users';

export const getOwnVoteForIssue = (issue, userId) => {
  // No issue? User haven't voted.
  if (!issue || !Object.keys(issue).length) return null;

  // No votes on current issue? User haven't voted.
  if (issue.votes && !Object.keys(issue.votes).length) return null;

  // Return the vote if it exists.
  const vote = Object.keys(issue.votes).find(voteId =>
    issue.votes[voteId].voter === userId);
  return issue.votes[vote];
};

export const getOwnVote = (state, userId) => (
  getOwnVoteForIssue(getIssue(state), userId)
);

export const issueVotesSelector = createSelector(
  getIssue,
  issue => (issue ? Object.keys(issue.votes).map(key => issue.votes[key]) : []),
);

export const voteWithNameSelector = createSelector(
  getIssue,
  issueVotesSelector,
  usersSelector,
  (issue, votes, users) => (
    votes.sort(({ id: id1 }, { id: id2 }) => {
      if (id1 < id2) {
        return 1;
      } else if (id1 > id2) {
        return -1;
      }
      return 0;
    })
    .filter(vote => !!vote.alternative)
    .map(({ randomName, voter, alternative }) => {
      let name;
      if (issue.secret) {
        if (randomName !== null) {
          name = randomName;
        } else {
          name = 'Anynom bruker';
        }
      } else {
        name = users[voter].name;
      }
      return {
        voter: name,
        alternative: issue.alternatives.find(alt => alt._id === alternative).text,
      };
    })
  ),
);
