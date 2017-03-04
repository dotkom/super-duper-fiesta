import { ADMIN_CREATE_ISSUE, ADMIN_CLOSE_ISSUE, TOGGLE_REGISTRATION } from '../actionTypes/adminButtons';

export const toggleRegistration = () => ({
  type: ADMIN_CREATE_ISSUE,
});

export const adminCloseIssue = data => ({
  type: ADMIN_CLOSE_ISSUE,
  data,
});

export const createIssue = data => ({
  type: TOGGLE_REGISTRATION,
  data,
});
