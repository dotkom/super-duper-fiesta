import React, { PropTypes } from 'react';
import ConcludedIssue from './ConcludedIssue';

const ConcludedIssueList = ({ issues }) => (
  <div className="ConcludedIssueList">
    {issues.map(issue => (
      <ConcludedIssue key={issue.id} {...issue} />
    ))}
  </div>
);

ConcludedIssueList.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.shape(ConcludedIssue.propTypes)).isRequired,
};

export default ConcludedIssueList;
