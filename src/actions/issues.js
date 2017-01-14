export const createIssue = (id, text, alternatives) => ({
  type: 'CREATE_ISSUE',
  id,
  text,
  alternatives,
});

export const sendVote = (id, alternative, voter) => ({
  type: 'SEND_VOTE',
  id,
  alternative,
  voter,
});

export const receiveVote = (id, alternative, voter) => ({
  type: 'RECEIVE_VOTE',
  id,
  alternative,
  voter,
});
