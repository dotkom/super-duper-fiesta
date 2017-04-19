import { CLOSE_ISSUE, OPEN_ISSUE, SEND_VOTE } from '../../../common/actionTypes/issues';

export const createIssue = (id, text, alternatives, voteDemand) => ({
  type: OPEN_ISSUE,
  id,
  text,
  alternatives,
  voteDemand,
});

export const closeIssue = data => ({
  type: CLOSE_ISSUE,
  data,
});

export const sendVote = (issueId, alternative, voter) => ({
  type: SEND_VOTE,
  issueId,
  alternative,
  voter,
});
