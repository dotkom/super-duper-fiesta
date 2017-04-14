import { ERROR_DISMISS } from '../actionTypes/error';

const errorReducer = (state = null, action) => {
  const { type, error, data } = action;
  if (type === ERROR_DISMISS) {
    return null;
  } else if (error) {
    return error;
  } else if (data && data.error) {
    return data.error;
  }

  return state;
};

export default errorReducer;
