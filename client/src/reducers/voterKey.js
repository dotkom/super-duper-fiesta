import { UPDATE_VOTER_KEY } from '../../../common/actionTypes/voterKey';

const voterKey = (state = 1, action) => {
  switch (action.type) {
    case UPDATE_VOTER_KEY:
      return action.key;

    default:
      return state;
  }
};

export default voterKey;
