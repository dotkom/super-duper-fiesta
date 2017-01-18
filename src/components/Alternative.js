import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/Alternative.css';

const Alternative = ({ _id: id, text, selected, ...other }) => {
  const alternativeClass = classNames('Alternative', {
    'Alternative--selected': selected,
  });
  return (
    <div className={alternativeClass} key={id}>
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
};

Alternative.defaultProps = {
  selected: false,
};

Alternative.propTypes = {
  _id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

export default Alternative;
