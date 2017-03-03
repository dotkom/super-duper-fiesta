import { connect } from 'react-redux';
import IssueAdmin from '../components/IssueAdmin';
import { closeIssue } from '../actions/issues';
import { getIssue } from '../selectors/issues';

const mapStateToProps = state => ({
  issue: getIssue(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeIssue: () => {
    dispatch(closeIssue({ data: ownProps.issue }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueAdmin);
