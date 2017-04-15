import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Card from './Card';
import css from './Dialog.css';

const Dialog = ({ visible, title, onClose, children }) => {
  const dialogClass = classNames(css.component, {
    [css.visible]: visible,
  });
  return (
    <div className={dialogClass}>
      <div onClick={onClose} className={css.backdrop} />
      <Card
        classes={css.dialog}
        title={title}
        corner={
          <div onClick={onClose} className={css.close} />
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
