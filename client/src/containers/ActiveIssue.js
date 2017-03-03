import { connect } from 'react-redux';
import Issue from '../components/Issue';
import { getIssueText } from '../selectors/issues';

const mapStateToProps = state => ({
  text: getIssueText(state),
});

export default connect(
  mapStateToProps,
)(Issue);
