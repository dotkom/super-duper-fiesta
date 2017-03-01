import React from 'react';
import '../css/Issue.css';

const Issue = ({ issue }) => (
  <div className="Issue">
    <h3 className="Issue-heading">Aktiv sak</h3>
    <p>{issue}</p>
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
