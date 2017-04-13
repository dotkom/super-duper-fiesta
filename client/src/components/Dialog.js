import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Card from './Card';
import '../css/Dialog.css';

const Dialog = ({ visible, title, onClose, children }) => {
  const dialogClass = classNames('Dialog', {
    'Dialog--visible': visible,
  });
  return (
    <div className={dialogClass}>
      <div onClick={onClose} className="Dialog-backdrop" />
      <Card
        classes="Dialog-dialog"
        title={title}
        corner={
          <div onClick={onClose} className="Dialog-close flaticon-close" />
        }
      >
        {children}
      </Card>
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
