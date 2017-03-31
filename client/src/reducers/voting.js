import { RECEIVE_VOTE } from '../actionTypes/voting';

const vote = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_VOTE:
      return {
        id: action.data._id, // eslint-disable-line no-underscore-dangle
        issue: action.data.question,
        alternative: action.data.option,
      };
    default:
      return state;
  }
};

const votes = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_VOTE:
      return [
        ...state,
        vote(state, action),
      ];
    default:
      return state;
  }
};

export default votes;
