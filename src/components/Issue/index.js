import React from 'react';
import './Issue.css';

const Issue = ({ issue }) => (
  <div className="Issue">
    <h3 className="Issue-heading">Aktiv sak</h3>
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
