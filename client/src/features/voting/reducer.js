import { RECEIVE_VOTE } from 'common/actionTypes/voting';

const votedState = (state = { lastVotes: [] }, action) => {
  switch (action.type) {
    case RECEIVE_VOTE: {
      let newLastVotes = state.lastVotes;
      newLastVotes.push(action.data.id);
      newLastVotes = newLastVotes.slice(Math.max(newLastVotes.length - 5, 0), newLastVotes.length);
      return {
        ...state,
        lastVotes: newLastVotes,
      };
    }

    default:
      return state;
  }
};

export default votedState;
