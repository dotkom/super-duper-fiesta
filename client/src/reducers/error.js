import { ERROR, ERROR_DISMISS } from '../../../common/actionTypes/error';

const errorsReducer = (state = {}, action) => {
  const { type, data } = action;

  switch (type) {
    case ERROR_DISMISS: {
      const { id } = data;
      return Object.keys(state).reduce((acc, key) => {
        const newState = acc;
        if (key !== id.toString()) {
          newState[key] = state[key];
        }
        return newState;
      }, {});
    }
    case ERROR: {
      return {
        ...state,
        [data.id]: data,
      };
    }
    default: return state;
  }
};

export default errorsReducer;
