import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import '../css/ConcludedIssueList.css';

const ConcludedIssueList = ({ issues }) => (
  <div className="ConcludedIssueList">
    {Object.keys(issues).map(issue => (
      <ConcludedIssue key={issues[issue].id} {...issues[issue]} />
    ))}
  </div>
);

ConcludedIssueList.propTypes = {
  issues: PropTypes.shape({}).isRequired,
};

export default ConcludedIssueList;
const mapStateToProps = state => ({
  issues: state.votingEnabled ? state.issues.slice(0, -1) : state.issues,
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
