import React, { PropTypes } from 'react';
import css from './VoteCounter.css';

const VoteCounter = ({ count, total, label }) => (
  <div className={css.counter}>
    <div className={css.label}>
      { label } <span className={css.count}>({ count } / { total })</span>
    </div>
    <div className={css.bar}>
      <div className={css.progress} style={{ width: `${(count / total) * 100}%` }} />
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
