export const createIssue = (id, text, alternatives, majorityTreshold) => ({
  type: 'CREATE_ISSUE',
  id,
  text,
  alternatives,
  majorityTreshold,
});

export const sendVote = (id, alternative, voter) => ({
  type: 'SEND_VOTE',
  id,
  alternative,
  voter,
});
