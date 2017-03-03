import { SET_USER_FILTER } from '../actions/setUserFilter';

const userFilter = (state = '', action) => {
  switch (action.type) {
    case SET_USER_FILTER:
      return action.filter;

    default:
      return state;
  }
};

export default userFilter;
