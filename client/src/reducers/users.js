import { ADD_USER, TOGGLE_CAN_VOTE, RECEIVE_USER_LIST } from '../../../common/actionTypes/users';

const user = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE: {
      if (state.id !== action.data._id) { // eslint-disable-line no-underscore-dangle
        return state;
      }

      return {
        ...state,
        canVote: action.data.canVote,
      };
    }

    case ADD_USER:
      return {
        id: action.user._id, // eslint-disable-line no-underscore-dangle
        name: action.user.name,
        canVote: action.user.canVote,
        registered: action.user.registerDate,
      };

    default:
      return state;
  }
};

const users = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE:
      return state.map(u => user(u, action));

    case RECEIVE_USER_LIST: // Expecting that receiving a user list contains all users.
      return action.data.map(u => user(undefined, { type: ADD_USER, user: u }));

    default:
      return state;
  }
};

export default users;
