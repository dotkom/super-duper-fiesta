import { ADMIN_SIGNED_IN, AUTH_SIGNED_IN, AUTH_REGISTERED }
  from '../../../common/actionTypes/auth';

const defaultState = {
  id: '',
  username: '',
  fullName: '',
  permissions: 0,
  reloadPage: false,
  loggedIn: false,
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_SIGNED_IN: {
      return {
        ...state,
        username: action.data.username,
        fullName: action.data.full_name,
        loggedIn: true,
        registered: action.data.completedRegistration,
        id: action.data.id,
        permissions: action.data.permissions,
      };
    }

    case AUTH_REGISTERED: {
      return {
        ...state,
        registered: action.data.registered,
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
