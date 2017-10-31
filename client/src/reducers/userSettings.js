import { TOGGLE_NOTIFICATION } from '../../../common/actionTypes/userSettings';

const initial = {
  notifications: false,
};

const userSettings = (state = initial, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATION: {
      return {
        ...state,
        notifications: !state.notifications,
      };
    }
    default:
      return state;
  }
};

export default userSettings;
