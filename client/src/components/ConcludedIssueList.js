import React, { PropTypes } from 'react';
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
