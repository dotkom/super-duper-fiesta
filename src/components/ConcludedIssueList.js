import React from 'react';
import ConcludedIssue from './ConcludedIssue';

export default ({ issues }) => (
  <div className="ConcludedIssueList">
    {issues.map(issue => (
      <ConcludedIssue key={issue.id} {...issue} />
    ))}
  </div>
);
