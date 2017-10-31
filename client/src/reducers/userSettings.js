import {
  TOGGLE_NOTIFICATION,
  TOGGLE_SHOW_CONCLUDED_ISSUE_LIST,
} from '../../../common/actionTypes/userSettings';

const initial = {
  notifications: false,
  concludedIssueList: false,
};

const userSettings = (state = initial, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATION: {
      return {
        ...state,
        notifications: !state.notifications,
      };
    }
    case TOGGLE_SHOW_CONCLUDED_ISSUE_LIST: {
      return {
        ...state,
        concludedIssueList: !state.concludedIssueList,
      };
    }
    default:
      return state;
  }
};

export default userSettings;
