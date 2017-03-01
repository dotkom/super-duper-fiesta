import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/Dialog.css';

const Dialog = ({ visible, title, onClose, children }) => {
  const dialogClass = classNames('Dialog', {
    'Dialog--visible': visible,
  });
  return (
    <div className={dialogClass}>
      <div onClick={onClose} className="Dialog-backdrop" />
      <div className="Dialog-dialog">
        <div className="Dialog-top">
          <div className="Dialog-title">{title}</div>
          <div onClick={onClose} className="Dialog-close flaticon-close" />
        </div>
        <div className="Dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
};

Dialog.defaultProps = {
  visible: false,
};

Dialog.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Dialog;
