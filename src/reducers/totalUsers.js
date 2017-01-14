export const totalUsers = (state = 0, action) => {
  switch (action.type) {
    case 'TOTAL_USERS_UPDATED':
      return state.totalUsers;

    default:
      return state;
  }
};
