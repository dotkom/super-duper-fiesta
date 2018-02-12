import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '../Card';
import css from './Dialog.css';

const Dialog = ({ visible, title, subtitle, onClose, children, hideCloseSymbol }) => {
  const dialogClass = classNames(css.component, {
    [css.visible]: visible,
  });
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  const corner = !hideCloseSymbol && <div
    onClick={onClose}
    className={css.close}
  />;
  return (
    <div className={dialogClass}>
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        onClick={onClose}
        className={css.backdrop}
      />
      <Card
        classes={css.dialog}
        title={title}
        subtitle={subtitle}
        corner={corner}
      >
        {children}
      </Card>
    </div>
  );
};

Dialog.defaultProps = {
  hideCloseSymbol: false,
  subtitle: '',
  visible: false,
};

Dialog.propTypes = {
  hideCloseSymbol: PropTypes.bool,
  visible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Dialog;
