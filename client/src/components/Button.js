import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/Button.css';

const Button = ({ size, children, background, ...other }) => {
  const buttonClass = classNames({
    'Button': true,
    [`Button--size-${size}`]: size,
    'Button--background': background,
  });
  return (
    <button className={buttonClass} {...other}>{children}</button>
  );
};

Button.defaultProps = {
  size: 'md',
  background: false,
};


Button.propTypes = {
  background: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Button;
