import { DISABLE_VOTING, ENABLE_VOTING } from '../actionTypes/voting';

const votingEnabled = (state = false, action) => {
  switch (action.type) {
    case ENABLE_VOTING:
      return true;

    case DISABLE_VOTING:
      return false;

    default:
      return state;
  }
};

export default votingEnabled;
