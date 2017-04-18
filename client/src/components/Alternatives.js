import React, { PropTypes } from 'react';
import Alternative from './Alternative';
import css from './Alternatives.css';

const Alternatives = ({ disabled, alternatives, handleChange, selectedVote }) => (
  <div className={css.lternatives}>
    {alternatives.map(alternative => (
      <Alternative
        disabled={disabled && alternative.id !== selectedVote}
        key={alternative.id} {...alternative}
        onClick={handleChange} selected={alternative.id === selectedVote}
      />
    ))}
  </div>
);

Alternatives.defaultProps = {
  selectedVote: null,
  handleChange: undefined,
  disabled: false,
};

Alternatives.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape(Alternative.propTypes)).isRequired,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  selectedVote: PropTypes.string,
};

export default Alternatives;
