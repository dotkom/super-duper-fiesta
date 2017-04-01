import { AUTH_SIGNED_IN, AUTH_SIGNED_OUT } from '../actionTypes/auth';

const signIn = (state = {}, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return {
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: action.data.logged_in,
        id: action.data.id,
      };
    }

    case AUTH_SIGNED_OUT: {
      return {
        id: '',
        username: '',
        fullName: '',
        loggedIn: false,
      };
    }

    default:
      return state;
  }
};

export default signIn;
