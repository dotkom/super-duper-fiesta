import { connect } from 'react-redux';
import Alternatives from '../Alternatives';

const mapStateToProps = state => ({
  // TODO: Reuse selectors from VoteHandler.
  alternatives: state.issues.length ? state.issues[state.issues.length - 1].alternatives : [],
});

export default connect(
  mapStateToProps,
)(Alternatives);
