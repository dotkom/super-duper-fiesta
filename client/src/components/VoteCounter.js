import React, { PropTypes } from 'react';
import '../css/VoteCounter.css';

const VoteCounter = ({ count, total, label }) => (
  <div className="VoteCounter">
    <div className="VoteCounter-label">
      { label } ({ count }/{ total })
    </div>
    <div className="VoteCounter-bar">
      <div className="VoteCounter-bar-progress" style={{ width: `${(count / total) * 100}%` }} />
    </div>
  </div>
);

VoteCounter.defaultProps = {
  total: 0,
  count: 0,
};

VoteCounter.propTypes = {
  total: PropTypes.number,
  count: PropTypes.number,
  label: PropTypes.string.isRequired,
};

export default VoteCounter;
