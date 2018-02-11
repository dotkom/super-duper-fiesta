import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import css from './Heading.css';

const Heading = ({ link, title, children }) => (
  <header className={css.heading}>
    <div className={css.content}>
      <Link to={link}><h1 className={css.header}>{title}</h1></Link>
      <nav className={css.components}>
        {children}
      </nav>
    </div>
  </header>
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
