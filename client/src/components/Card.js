import React, { PropTypes } from 'react';
import classNames from 'classnames';
import css from './Card.css';

const Card = ({ classes, headerColor, title, corner, subtitle, children }) => {
  const titleTag = title || corner ? (
    <div className={classNames(css.header, css[headerColor])}>
      <h2>{title}</h2>
      {corner ? <div className={css.corner}>{corner}</div> : null}
    </div>
  ) : null;
  return (
    <div className={classNames(css.card, classes)}>
      {titleTag}
      <div className={css.content}>
        {subtitle ? <h3 className={css.subtitle}>{subtitle}</h3> : null}
        {children}
      </div>
    </div>
  );
};

Card.defaultProps = {
  classes: '',
  title: '',
  subtitle: '',
  corner: '',
  headerColor: 'blue',
};

Card.propTypes = {
  classes: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  corner: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  headerColor: PropTypes.string,
};

export default Card;
