export const toggleRegistration = () => ({
  type: 'TOGGLE_REGISTRATION',
});

export const createIssue = data => ({
  type: 'server/ADMIN_CREATE_ISSUE',
  data,
});
