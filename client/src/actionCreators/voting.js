import { SUBMIT_ANONYMOUS_VOTE, SUBMIT_REGULAR_VOTE,
  DISABLE_VOTING, ENABLE_VOTING, RECEIVE_VOTE, VOTING_STATE } from '../actionTypes/voting';

export const disableVoting = () => ({
  type: DISABLE_VOTING,
});

export const enableVoting = () => ({
  type: ENABLE_VOTING,
});

export const submitRegularVote = (issue, alternative) => ({
  type: SUBMIT_REGULAR_VOTE,
  issue,
  alternative,
});

export const submitAnonymousVote = (issue, alternative, passwordHash) => ({
  type: SUBMIT_ANONYMOUS_VOTE,
  issue,
  alternative,
  passwordHash,
});

export const receiveVote = vote => ({
  type: RECEIVE_VOTE,
  vote,
});

export const setVoteState = voteState => ({
  type: VOTING_STATE,
  voteState,
});
