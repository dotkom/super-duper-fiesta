import { VOTING_STATE } from '../../../common/actionTypes/voting';

const votedState = (state = false, action) => {
  switch (action.type) {
    case VOTING_STATE:
      return {
        voted: action.data.voted,
      };

    default:
      return state;
  }
};

export default votedState;
