import React from 'react';
import '../css/Issue.css';

const Issue = ({ issue }) => (
  <div className="Issue">
    <h2 className="Issue-heading">Aktiv sak</h2>
    <p>{issue.text}</p>
  </div>
);

Issue.defaultProps = {
  issue: {
    _id: '-1',
    text: 'Ingen aktiv sak.',
  },
};

Issue.propTypes = {
  issue: React.PropTypes.shape({
    _id: React.PropTypes.string,
    text: React.PropTypes.string,
  }),
};

export default Issue;
