export const voterKey = (state = 1, action) => {
  switch (action.type) {
    case 'UPDATE_VOTER_KEY':
      return action.key;

    default:
      return state;
  }
};
