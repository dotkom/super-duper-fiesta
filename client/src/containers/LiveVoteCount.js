import { connect } from 'react-redux';
import VoteCounter from '../components/VoteCounter';

const mapStateToProps = state => ({
  // The number of votes on the current issue.
  voteCount: state.issues.length ? state.issues[state.issues.length - 1].votes.length : 0,
  // The number of users eligible for voting on the current issue.
  userCount: state.users.filter(u => u.canVote).length,
});

export default connect(
  mapStateToProps,
)(VoteCounter);
