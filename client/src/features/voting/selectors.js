import { getIssue } from '../issue/selectors';

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
