import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/IconText.css';


const IconText = ({ text, iconClass }) => (
  <div className={classNames('IconText', iconClass)}>
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
