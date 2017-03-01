import React from 'react';
import '../css/Issue.css';

const Issue = ({ issue }) => (
  <div className="Issue">
    <h2 className="Issue-heading">Aktiv sak</h2>
    <p>{issue}</p>
  </div>
);

Issue.defaultProps = {
  issue: undefined,
};

Issue.propTypes = {
  issue: React.PropTypes.string,
};

export default Issue;
