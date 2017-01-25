export const createIssue = (id, text, alternatives, voteDemand) => ({
  type: 'OPEN_ISSUE',
  id,
  text,
  alternatives,
  voteDemand,
});

export const sendVote = (id, alternative, voter) => ({
  type: 'SEND_VOTE',
  id,
  alternative,
  voter,
});
