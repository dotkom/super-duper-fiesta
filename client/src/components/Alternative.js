import React, { PropTypes } from 'react';
import classNames from 'classnames';
import css from './Alternative.css';

const Alternative = ({ disabled, id, text, selected, onClick }) => {
  const alternativeClass = classNames(css.alternative, {
    [css.selected]: selected,
    [css.disabled]: disabled,
  });
  return (
    <div className={alternativeClass} key={id}>
      <label>
        <input
          disabled={disabled}
          type="radio"
          name="vote"
          value={id}
          id={id}
          onClick={onClick}
        />
        {text}
      </label>
    </div>
  );
};

Alternative.defaultProps = {
  onClick: undefined,
  selected: false,
  disabled: false,
};

Alternative.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

export default Alternative;
