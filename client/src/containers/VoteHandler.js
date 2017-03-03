import { connect } from 'react-redux';
import VotingMenu from '../components/VotingMenu';
import { sendVote } from '../actionCreators/issues';
import getShuffledAlternatives from '../selectors/getShuffledAlternatives';
import { getIssueId, getIssueKey } from '../selectors/issues';

const mapStateToProps = state => ({
  // Alternatives are shuffled as an attempt to prevent peeking over shoulders
  // to figure out what another person has voted for. This scramble needs
  // to be syncronized between LiveVoteCount and VoteHandler, so we take
  // advantage of the memoizing provided by reselect. This keeps the
  // scrambles in sync and avoids rescrambling unless the
  // available alternatives are changed.
  alternatives: getShuffledAlternatives(state),

  votes: getIssueKey(state, 'votes', []),

  // The ID, or undefined, if there is no current issue.
  issueId: getIssueId(state),

  voterKey: state.voterKey,
});

const mapDispatchToProps = dispatch => ({
  handleVote: (id, alternative, voter) => {
    dispatch(sendVote(id, alternative, voter));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingMenu);
