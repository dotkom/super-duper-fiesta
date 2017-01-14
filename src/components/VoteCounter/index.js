import React from 'react';

const VoteCounter = ({ userCount, voteCount }) => (
  <div className="VoteCounter">
    <p>Stemmer: <b>{voteCount}</b> av <b>{userCount}</b> </p>
  </div>
);

VoteCounter.defaultProps = {
  userCount: 0,
  voteCount: 0,
};

VoteCounter.propTypes = {
  userCount: React.PropTypes.number,
  voteCount: React.PropTypes.number,
};

export default VoteCounter;
