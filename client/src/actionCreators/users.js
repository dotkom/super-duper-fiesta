import { ADD_USER, TOGGLE_CAN_VOTE } from '../actions/users';

export const toggleCanVote = id => ({
  type: TOGGLE_CAN_VOTE,
  id,
});

export const addUser = (id, name) => ({
  type: ADD_USER,
  id,
  name,
});
