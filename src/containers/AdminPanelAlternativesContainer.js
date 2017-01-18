import { connect } from 'react-redux';
import AdminPanelAlternatives from '../components/AdminPanelAlternatives';

const mapStateToProps = state => ({
  // TODO: Reuse selectors from VoteHandler.
  alternatives: state.issues.length ? state.issues[state.issues.length - 1].alternatives : [],
});

export default connect(
  mapStateToProps,
)(AdminPanelAlternatives);
