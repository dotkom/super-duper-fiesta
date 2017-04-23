import { AUTH_SIGNED_IN, AUTH_SIGNED_OUT, AUTH_REGISTERED } from '../../../common/actionTypes/auth';

const defaultState = {
  id: '',
  username: '',
  fullName: '',
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return {
        ...state,
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: action.data.logged_in,
        registered: action.data.completedRegistration,
        id: action.data.id,
      };
    }

    case AUTH_SIGNED_OUT: {
      return {
        ...defaultState,
        registered: false,
        loggedIn: false,
      };
    }

    case AUTH_REGISTERED: {
      return {
        ...state,
        registered: true,
      };
    }

    default:
      return state;
  }
};

export default auth;
