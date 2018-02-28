import { createSelector } from 'reselect';
import { getIssue } from '../issue/selectors';
import { usersSelector } from '../user/selectors';

export const getLastVotes = state => state.lastVotes;

export const issueVotesSelector = createSelector(
  getIssue,
  getLastVotes,
  (issue, lastVotes) => (
    issue ? lastVotes.map(key => issue.votes[key]) : []
  ),
);

export const voteWithNameSelector = createSelector(
  getIssue,
  issueVotesSelector,
  usersSelector,
  (issue, votes, users) => (
    votes
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
        alternative: issue.alternatives.find(alt => alt.id === alternative).text,
      };
    })
  ),
);
