import { ADD_USER, ADMIN_TOGGLE_CAN_VOTE, RECEIVE_USER_LIST,
   TOGGLE_CAN_VOTE } from '../../../common/actionTypes/users';

export const toggleCanVote = user => ({
  type: TOGGLE_CAN_VOTE,
  user,
});

export const adminToggleCanVote = (id, canVote) => ({
  type: ADMIN_TOGGLE_CAN_VOTE,
  canVote,
  id,
});

export const addUser = (id, name, registered) => ({
  type: ADD_USER,
  id,
  name,
  registered,
});

export const retrievedUserList = users => ({
  type: RECEIVE_USER_LIST,
  users,
});
