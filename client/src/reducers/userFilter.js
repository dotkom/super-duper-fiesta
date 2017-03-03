import { SET_USER_FILTER } from '../actionTypes/setUserFilter';

const userFilter = (state = '', action) => {
  switch (action.type) {
    case SET_USER_FILTER:
      return action.filter;

    default:
      return state;
  }
};

export default userFilter;
