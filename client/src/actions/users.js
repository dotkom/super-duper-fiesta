export const toggleCanVote = id => ({
  type: 'TOGGLE_CAN_VOTE',
  id,
});

export const addUser = (id, name) => ({
  type: 'ADD_USER',
  id,
  name,
});
