import { getIssue } from './issues';

export const getOwnVoteForIssue = (issue, userId) => {
  // No issue? User haven't voted.
  if (!issue || !Object.keys(issue).length) return null;

  // No votes on current issue? User haven't voted.
  if (issue.votes && !Object.keys(issue.votes).length) return null;

  // Return the vote if it exists.
  return issue.votes[userId];
};

export const getOwnVote = (state, userId) => (
  getOwnVoteForIssue(getIssue(state), userId)
);
