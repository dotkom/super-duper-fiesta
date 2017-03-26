import { AUTH_SIGNED_IN, AUTH_SIGNED_OUT } from '../actionTypes/auth';

const signIn = (state = {}, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return {
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: action.data.logged_in,
      };
    }

    case AUTH_SIGNED_OUT: {
      return {
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
