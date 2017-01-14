import { connect } from 'react-redux';
import ConcludedIssueList from '../components/ConcludedIssueList';

const mapStateToProps = state => ({
  issues: state.votingEnabled ? state.issues.slice(0, -1) : state.issues,
});

export default connect(
  mapStateToProps,
)(ConcludedIssueList);
