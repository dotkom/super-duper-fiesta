export const createIssue = (id, text, alternatives) => ({
  type: 'CREATE_ISSUE',
  id,
  text,
  alternatives,
});

export const vote = (id, alternative) => ({
  type: 'VOTE',
  id,
  alternative,
});
