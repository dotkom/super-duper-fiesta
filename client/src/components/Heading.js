import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../css/Heading.css';

const Heading = ({ link, title, children }) => (
  <div className="Heading">
    <div className="Heading-content">
      <Link to={link}><h1 className="Heading-header">{title}</h1></Link>
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
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Heading;
