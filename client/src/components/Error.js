import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { dismissError } from '../actionCreators/error';
import css from './Error.css';

const Error = ({ dismiss, message }) => {
  if (!message) {
    return null;
  }
  return (
    <div className={css.error}>
      <span className={css.message}>{message}</span>
      { dismiss &&
        <button className={css.corner} onClick={dismiss}>
          <div className={css.close} />
        </button>
      }
    </div>
  );
};

Error.defaultProps = {
  message: null,
  dismiss: null,
};

Error.propTypes = {
  message: PropTypes.string,
  dismiss: PropTypes.func,
};

export default Error;

const mapStateToProps = ({ error }) => ({
  message: error,
});
const mapDispatchToProps = dispatch => ({
  dismiss: () => dispatch(dismissError()),
});
export const ErrorContainer = connect(mapStateToProps, mapDispatchToProps)(Error);
