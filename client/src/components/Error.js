import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { dismissError } from '../actionCreators/error';
import '../css/Error.css';

const Error = ({ dismiss, message }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="Error">
      <span className="Error-message">{message}</span>
      { dismiss &&
        <button className="Error-corner" onClick={dismiss}>
          <div className="flaticon-close" />
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
