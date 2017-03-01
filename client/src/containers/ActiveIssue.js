import { connect } from 'react-redux';
import Issue from '../components/Issue';
import { getIssue } from '../selectors/issues';

const mapStateToProps = state => ({
  issue: getIssue(state),
});

export default connect(
  mapStateToProps,
)(Issue);
