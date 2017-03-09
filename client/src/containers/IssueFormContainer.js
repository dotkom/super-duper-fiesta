import { connect } from 'react-redux';
import IssueForm from '../components/IssueForm';
import { createIssue } from '../actionCreators/adminButtons';
import { getIssue } from '../selectors/issues';

const mapStateToProps = state => ({
  issue: getIssue(state),
  issueDescription: state.issueDescription ? state.issueDescription : '',
});

const mapDispatchToProps = dispatch => ({
  createIssue: (description, alternatives, voteDemand, showOnlyWinner, secretElection) => {
    console.log('Adding issue', description);
    dispatch(createIssue(description, alternatives, voteDemand, showOnlyWinner, secretElection));
  },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssueForm);
