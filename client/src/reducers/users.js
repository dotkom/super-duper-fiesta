import { ADD_USER, TOGGLE_CAN_VOTE } from '../actionTypes/users';

const user = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE:
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        canVote: !state.canVote,
      };

    case ADD_USER:
      return {
        id: action.id,
        name: action.name,
        canVote: false,
      };

    default:
      return state;
  }
};

const defaultUsers = [
  {
    id: 0,
    canVote: true,
    name: 'Torjus Iveland',
  },

  {
    id: 1,
    canVote: false,
    name: 'Håkon Solbjørg',
  },
];

const users = (state = defaultUsers, action) => {
  switch (action.type) {
    case TOGGLE_CAN_VOTE:
      return state.map(u => user(u, action));

    case ADD_USER:
      return [...state, user(undefined, action)];

    default:
      return state;
  }
};

export default users;
