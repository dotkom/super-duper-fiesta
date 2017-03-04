import React from 'react';
import '../css/Issue.css';

const Issue = ({ text }) => (
  <div className="Issue">
    <h2 className="Issue-heading">Aktiv sak</h2>
    <p>{text}</p>
  </div>
);

Issue.defaultProps = {
  text: 'Ingen aktiv sak for øyeblikket.',
};

Issue.propTypes = {
  text: React.PropTypes.string,
};

export default Issue;
