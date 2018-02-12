import React from 'react';
import PropTypes from 'prop-types';
import Alternative from './Alternative';
import css from './Alternatives.css';

const Alternatives = ({ disabled, alternatives, handleChange, selectedVote }) => (
  <div className={css.alternatives}>
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
