import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/Button.css';

const Button = ({ size, children, ...other }) => {
  const buttonClass = classNames('Button', `Button--size-${size}`);
  return (
    <button className={buttonClass} {...other}>{children}</button>
  );
};

Button.defaultProps = {
  size: 'md',
};


Button.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Button;
