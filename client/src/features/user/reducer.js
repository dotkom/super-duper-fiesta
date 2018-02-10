import { ADD_USER, TOGGLE_CAN_VOTE, RECEIVE_USER_LIST } from 'common/actionTypes/users';

const user = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE: {
      if (state.id !== action.data.id) {
        return state;
      }

      return {
        ...state,
        canVote: action.data.canVote,
      };
    }

    case ADD_USER:
      return {
        id: action.user.id,
        name: action.user.name,
        canVote: action.user.canVote,
        completedRegistration: action.user.completedRegistration,
        registered: action.user.registerDate,
        permissions: action.user.permissions,
      };

    default:
      return state;
  }
};

const users = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE:
      return {
        ...state,
        [action.data.id]: user(state[action.data.id], action),
      };

    case RECEIVE_USER_LIST: // Expecting that receiving a user list contains all users.
      return action.data.map(u => user(undefined, { type: ADD_USER, user: u }))
        .reduce((prev, u) => ({ ...prev, [u.id]: u }), {});

    case ADD_USER: {
      const u = user(undefined, { type: ADD_USER, user: action.data });
      return {
        ...state,
        [u.id]: u,
      };
    }

    default:
      return state;
  }
};

export default users;
