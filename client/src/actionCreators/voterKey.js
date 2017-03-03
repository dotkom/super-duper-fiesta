import { UPDATE_VOTER_KEY } from '../actions/voterKey';

export const updateVoterKey = key => ({
  type: UPDATE_VOTER_KEY,
  key,
});

