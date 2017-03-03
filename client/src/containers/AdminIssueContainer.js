import { connect } from 'react-redux';
import IssueAdmin from '../components/IssueAdmin';
import { closeIssue } from '../actions/issues';
import { getIssue } from '../selectors/issues';

const mapStateToProps = state => ({
  issue: getIssue(state),
});

// Following this example since we need id from state
// https://github.com/reactjs/react-redux/issues/237#issuecomment-168817739
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...ownProps,
    closeIssue: () => {
      dispatch(closeIssue({ data: stateProps.issue }));
    },
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps,
)(IssueAdmin);
