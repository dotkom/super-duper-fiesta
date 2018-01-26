import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { dismissError } from '../../features/error/actionCreators';
import css from './Error.css';

const Error = ({ errors, dismiss }) => (
  <div>
    { errors.map(error => (
      <div key={error.id} className={css.error}>
        <span className={css.message}>{error.message}</span>
        <button className={css.corner} onClick={() => dismiss(error.id)}>
          <div className={css.close} />
        </button>
      </div>
    ))}
  </div>
);

Error.defaultProps = {
  errors: [],
};

Error.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.string,
  })),
  dismiss: PropTypes.func.isRequired,
};

export default Error;

const mapStateToProps = ({ error }) => ({
  errors: Object.keys(error).map(key => error[key]),
});
const mapDispatchToProps = {
  dismiss: dismissError,
};
export const ErrorContainer = connect(mapStateToProps, mapDispatchToProps)(Error);
