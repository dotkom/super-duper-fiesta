import { UPDATE_VOTER_KEY } from '../../../common/actionTypes/voterKey';

// eslint-disable-next-line import/prefer-default-export
export const updateVoterKey = key => ({
  type: UPDATE_VOTER_KEY,
  key,
});

