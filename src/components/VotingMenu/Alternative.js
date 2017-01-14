import React, { PropTypes } from 'react';
import './Alternative.css';

const Alternative = ({ id, text, ...other }) => (
  <div className="Alternative" key={id}>
    <label>
      <input
        type="radio"
        name="vote"
        value={id}
        id={id}
        {...other}
      />
      {text}
    </label>
  </div>
);

Alternative.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default Alternative;
