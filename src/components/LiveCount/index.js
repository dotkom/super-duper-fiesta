import React from 'react';

const LiveCount = ({ userCount, voteCount }) => (
  <div className="LiveCount">
    <p>Stemmer: <b>{voteCount}</b> av <b>{userCount}</b> </p>
  </div>
);

LiveCount.propTypes = {
  userCount: React.propTypes.number.isRequired,
  voteCount: React.propTypes.number.isRequired,
};

export default LiveCount;
