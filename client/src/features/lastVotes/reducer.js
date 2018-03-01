import { OPEN_ISSUE } from 'common/actionTypes/issues';
import { RECEIVE_VOTE } from 'common/actionTypes/voting';

const lastVotes = (state = [], action) => {
  switch (action.type) {
    case OPEN_ISSUE: {
      return [];
    }
    case RECEIVE_VOTE: {
      return [...state.slice(-5), action.data.id];
    }

    default:
      return state;
  }
};

export default lastVotes;
