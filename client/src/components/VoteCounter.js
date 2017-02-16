import React from 'react';
import '../css/VoteCounter.css';

const VoteCounter = ({ userCount, voteCount }) => (
  <div className="VoteCounter">
    <div className="VoteCounter-label">
      Stemmer ({voteCount}/{userCount})
    </div>
    <div className="VoteCounter-bar">
      <div className="VoteCounter-bar-progress" style={{ width: `${(voteCount / userCount) * 100}%` }} />
    </div>
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
