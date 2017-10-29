import { TOGGLE_NOTIFICATION } from '../../../common/actionTypes/notification';

const notification = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATION: {
      return !state;
    }
    default:
      return state;
  }
};

export default notification;
