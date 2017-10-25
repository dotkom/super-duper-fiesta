import { ADMIN_SIGNED_IN, AUTH_SIGNED_IN, AUTH_SIGNED_OUT, AUTH_REGISTERED }
  from '../../../common/actionTypes/auth';

const defaultState = {
  id: '',
  username: '',
  fullName: '',
  permissions: 0,
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
        permissions: action.data.permissions,
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
        registered: action.data.registered,
      };
    }

    case ADMIN_SIGNED_IN: {
      window.location.reload();
      break;
    }

    default:
      return state;
  }
};

export default auth;
