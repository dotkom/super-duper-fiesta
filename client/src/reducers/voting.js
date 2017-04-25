import { CLOSE_ISSUE, OPEN_ISSUE } from '../../../common/actionTypes/issues';
import { VOTING_STATE } from '../../../common/actionTypes/voting';

const votedState = (state = false, action) => {
  switch (action.type) {
    case VOTING_STATE:
      return {
        voted: action.data.voted,
      };
    case CLOSE_ISSUE:
    case OPEN_ISSUE:
      return {
        voted: false,
      };

    default:
      return state;
  }
};

export default votedState;
