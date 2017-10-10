import { AUTH_ERROR, ERROR_DISMISS } from '../../../common/actionTypes/error';

const errorReducer = (state = null, action) => {
  const { type, data } = action;

  switch (type) {
    case ERROR_DISMISS: return null;
    case AUTH_ERROR: {
      return data.error;
    }
    default: return state;
  }
};

export default errorReducer;
