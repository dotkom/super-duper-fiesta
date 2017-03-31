import { ADD_USER, FETCHING_USER_LIST_STATE, REQUEST_USER_LIST, RECEIVE_USER_LIST,
   TOGGLE_CAN_VOTE } from '../actionTypes/users';

export const toggleCanVote = id => ({
  type: TOGGLE_CAN_VOTE,
  id,
});

export const addUser = (id, name, registered) => ({
  type: ADD_USER,
  id,
  name,
  registered,
});

export const requestUserList = () => ({
  type: REQUEST_USER_LIST,
});

export const retrievedUserList = users => ({
  type: RECEIVE_USER_LIST,
  users,
});
