import React, { PropTypes } from 'react';
import Alternative from './Alternative';
import '../css/Alternatives.css';

const Alternatives = ({ alternatives, handleChange, selectedVote }) => (
  <div className="Alternatives">
    {alternatives.map(alternative => (
      <Alternative
        key={alternative.id} {...alternative}
        onClick={handleChange} selected={alternative.id === selectedVote}
      />
    ))}
  </div>
);

Alternatives.defaultProps = {
  selectedVote: null,
  handleChange: undefined,
};

Alternatives.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape(Alternative.propTypes)).isRequired,
  handleChange: PropTypes.func,
  selectedVote: PropTypes.number,
};

export default Alternatives;
