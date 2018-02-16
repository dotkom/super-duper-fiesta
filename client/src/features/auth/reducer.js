import { ADMIN_SIGNED_IN, AUTH_SIGNED_IN, AUTH_AUTHENTICATED } from 'common/actionTypes/auth';

const defaultState = {
  id: '',
  username: '',
  fullName: '',
  permissions: 0,
  reloadPage: false,
  loggedIn: false,
  registered: false,
  authenticated: false,
  canVote: false,
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return {
        ...state,
        canVote: action.data.canVote,
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: true,
        registered: action.data.completedRegistration,
        id: action.data.id,
        permissions: action.data.permissions,
      };
    }

    case AUTH_AUTHENTICATED: {
      return {
        ...state,
        authenticated: action.data.authenticated,
      };
    }

    case ADMIN_SIGNED_IN: {
      return {
        ...state,
        reloadPage: true,
      };
    }

    default:
      return state;
  }
};

export default auth;
