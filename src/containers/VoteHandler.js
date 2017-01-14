import { connect } from 'react-redux';
import VotingMenu from '../components/VotingMenu';
import { vote } from '../actions/issues';

const mapStateToProps = state => ({
  alternatives: state.issues.length ? state.issues[state.issues.length - 1].alternatives : [],

  votes: state.issues.length ? state.issues[state.issues.length - 1].votes : [],

  // The ID, or undefined, if there is no current issue.
  id: state.issues.length && state.issues[state.issues.length - 1].id,

  voterKey: state.voterKey,
});

const mapDispatchToProps = dispatch => ({
  handleVote: (id, alternative, voter) => {
    dispatch(vote(id, alternative, voter));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingMenu);
