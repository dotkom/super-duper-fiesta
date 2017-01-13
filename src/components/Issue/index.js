import React from 'react';

const Issue = ({ issue }) => (
  <div className="ActiveIssue">
    <h3>Aktiv sak</h3>
    <p>{issue}</p>
  </div>
);

Issue.propTypes = {
  issue: React.PropTypes.string.isRequired,
};

export default Issue;
