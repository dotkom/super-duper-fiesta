import React, { PropTypes } from 'react';
import Alternative from './Alternative';
import '../css/Alternatives.css';

const Alternatives = ({ alternatives, handleChange }) => (
  <div className="Alternatives">
    {alternatives.map(alternative => (
      <Alternative key={alternative.id} {...alternative} onClick={handleChange} />
    ))}
  </div>
);

Alternatives.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape(Alternative.propTypes)).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Alternatives;
