import {
  TOGGLE_NOTIFICATION,
  TOGGLE_SHOW_CONCLUDED_ISSUE_LIST,
} from 'common/actionTypes/userSettings';

export const toggleNotification = () => ({
  type: TOGGLE_NOTIFICATION,
});

export const toggleShowConcludedIssueList = () => ({
  type: TOGGLE_SHOW_CONCLUDED_ISSUE_LIST,
});
