import React, { PropTypes } from 'react';
import classNames from 'classnames';
import css from './IconText.css';


const IconText = ({ text, iconClass }) => (
  <div className={classNames(css.iconText, iconClass)}>
    {text}
  </div>
);

IconText.defaultProps = {
  text: '',
};

IconText.propTypes = {
  text: PropTypes.string,
  iconClass: PropTypes.string.isRequired,
};

export default IconText;
