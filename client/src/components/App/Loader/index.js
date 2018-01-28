import React from 'react';
import classNames from 'classnames';
import css from './Loader.css';

const Loader = () => (
  <div className={css.loader}>
    <div className={classNames(css.loaderPart, css.loaderFirst)} />
    <div className={classNames(css.loaderPart, css.loaderSecond)} />
  </div>
);

export default Loader;
