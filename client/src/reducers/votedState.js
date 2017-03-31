import { VOTING_STATE } from '../actionTypes/voting';

const votedState = (state = false, action) => {
  switch (action.type) {
    case VOTING_STATE: {
      return action.data.voted;
    }
    default:
      return state;
  }
};

export default votedState;
