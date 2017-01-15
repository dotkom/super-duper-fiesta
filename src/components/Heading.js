import React, { PropTypes } from 'react';
import '../css/Heading.css';

const Heading = ({ title, children }) => (
  <div className="Heading">
    <div className="Heading-content">
      <h2 className="Heading-header">{title}</h2>
      <div className="Heading-components">
        {children}
      </div>
    </div>
  </div>
);

Heading.defaultProps = {
  children: null,
};

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
};

export default Heading;
