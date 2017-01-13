import React from 'react';

const LiveCount = ({ userCount, voteCount }) => (
  <div className="LiveCount">
    <p>Stemmer: <b>{voteCount}</b> av <b>{userCount}</b> </p>
  </div>
);

LiveCount.propTypes = {
  userCount: React.PropTypes.number.isRequired,
  voteCount: React.PropTypes.number.isRequired,
};

export default LiveCount;
