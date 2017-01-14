import { connect } from 'react-redux';
import VotingMenu from '../components/VotingMenu';
import { vote } from '../actions/issues';

const mapStateToProps = state => ({
  alternatives: state.issues.length ? state.issues[state.issues.length - 1].alternatives : [],

  // The ID, or undefined, if there is no current issue.
  id: state.issues.length && state.issues[state.issues.length - 1].id,
});

const mapDispatchToProps = dispatch => ({
  handleVote: (id, alternative) => {
    dispatch(vote(id, alternative));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingMenu);
