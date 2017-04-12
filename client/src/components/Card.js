import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/Card.css';

const Card = ({ classes, title, corner, subtitle, children }) => {
  const titleTag = title || corner ? (
    <div className="Card-header">
      <h2>{title}</h2>
      {corner ? <div className="Card-corner">{corner}</div> : null}
    </div>
  ) : null;
  return (
    <div className={classNames('Card', classes)}>
      {titleTag}
      <div className="Card-content">
        {subtitle ? <h3 className="Card-subtitle">{subtitle}</h3> : null}
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
};

export default Card;
