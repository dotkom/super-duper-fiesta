import { connect } from 'react-redux';
import VoteStatus from '../components/VoteStatus';
import getShuffledAlternatives from '../selectors/getShuffledAlternatives';

const mapStateToProps = (state) => {
  const currentIssue = state.issues[state.issues.length - 1];

  // The number of votes on the current issue.
  const voteCount = currentIssue ? currentIssue.votes.length : 0;

  // The number of users eligible for voting on the current issue.
  const userCount = state.users.filter(u => u.canVote).length;

  const votePercentages = {};

  // Alternatives are shuffled as an attempt to prevent peeking over shoulders
  // to figure out what another person has voted for. This scramble needs
  // to be syncronized between LiveVoteCount and VoteHandler, so we take
  // advantage of the memoizing provided by reselect. This keeps the
  // scrambles in sync and avoids rescrambling unless the
  // available alternatives are changed.
  const alternatives = currentIssue && getShuffledAlternatives(state);

  if (currentIssue) {
    currentIssue.votes.forEach((issue) => {
      votePercentages[issue.alternative] = (votePercentages[issue.alternative] || 0) + 1;
    });
  }

  return { voteCount, userCount, alternatives, votePercentages };
};

export default connect(
  mapStateToProps,
)(VoteStatus);
