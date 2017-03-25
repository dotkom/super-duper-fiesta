import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import { IssueContainer } from '../Issue';
import { adminCloseIssue } from '../../actionCreators/adminButtons';
import { getIssue } from '../../selectors/issues';

const IssueAdmin = ({ closeIssue, issue }) => (
  <div>
    <IssueContainer />
    <Button background onClick={closeIssue} hidden={!issue}>Avslutt sak</Button>
  </div>
);

IssueAdmin.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
};

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
      dispatch(adminCloseIssue({ issue: stateProps.issue.id, user: 'admin' }));
    },
  };
};

export default IssueAdmin;
export const IssueAdminContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(IssueAdmin);
