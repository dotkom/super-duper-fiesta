import { AUTH_SIGNED_IN, AUTH_SIGNED_OUT, AUTH_REGISTERED } from '../../../common/actionTypes/auth';

const defaultState = {
  id: '',
  username: '',
  fullName: '',
  loggedIn: false,
  registered: false,
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return Object.assign({}, state, {
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: action.data.logged_in,
        id: action.data.id,
      });
    }

    case AUTH_SIGNED_OUT: {
      return defaultState;
    }

    case AUTH_REGISTERED: {
      return Object.assign({}, state, {
        registered: true,
      });
    }

    default:
      return state;
  }
};

export default auth;
