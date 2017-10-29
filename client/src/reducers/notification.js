import { TOGGLE_NOTIFICATION } from '../../../common/actionTypes/notification';

const initial = {
  enabled: false,
};

const notification = (state = initial, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATION: {
      return {
        ...state,
        enabled: !state.enabled,
      };
    }
    default:
      return state;
  }
};

export default notification;
