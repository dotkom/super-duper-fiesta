import { connect } from 'react-redux';
import VoteCounter from '../components/VoteCounter';

const mapStateToProps = state => ({
  voteCount: state.issues.length ? state.issues[state.issues.length - 1].votes.length : 0,
  userCount: state.userCount,
});

export default connect(
  mapStateToProps,
)(VoteCounter);
