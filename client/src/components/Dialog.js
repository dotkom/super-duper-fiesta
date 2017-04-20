import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Card from './Card';
import css from './Dialog.css';

const Dialog = ({ visible, title, onClose, children, hideCloseSymbol }) => {
  const dialogClass = classNames(css.component, {
    [css.visible]: visible,
  });
  return (
    <div className={dialogClass}>
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        onClick={onClose}
        className={css.backdrop}
      />
      <Card
        classes={css.dialog}
        title={title}
        corner={
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            onClick={onClose}
            className={css.close}
            hidden={hideCloseSymbol}
          />
        }
      >
        {children}
      </Card>
    </div>
  );
};

Dialog.defaultProps = {
  hideCloseSymbol: false,
  visible: false,
};

Dialog.propTypes = {
  hideCloseSymbol: PropTypes.bool,
  visible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Dialog;
