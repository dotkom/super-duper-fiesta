import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './IconText.css';


const IconText = ({ text, iconClass, hovering }) => {
  const iconTextClass = classNames(css.iconText, iconClass, {
    [css.hovering]: hovering,
  });
  return (
    <div className={iconTextClass}>
      {text}
    </div>
  );
};

IconText.defaultProps = {
  text: '',
  hovering: false,
};

IconText.propTypes = {
  text: PropTypes.string,
  iconClass: PropTypes.string.isRequired,
  hovering: PropTypes.bool,
};

export default IconText;
