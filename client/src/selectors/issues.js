export const activeIssueExists = state => (
  state.issues && Object.keys(state.issues).some(id => state.issues[id].active)
);

export const getIssue = state => (
  state.issues[Object.keys(state.issues).find(issueId => state.issues[issueId].active)]
);

const getKeyForIssueObjIfExists = (state, key, defaultValue = undefined) => {
  const issue = getIssue(state);

  if (issue && issue[key] !== undefined) {
    return issue[key];
  }

  return defaultValue;
};

export const getIssueText = state => getKeyForIssueObjIfExists(state, 'text', 'Ingen aktiv sak for øyeblikket.');
export const getIssueId = state => getKeyForIssueObjIfExists(state, 'id', '');
export const getIssueKey = (state, key, defaultValue) => getKeyForIssueObjIfExists(state, key, defaultValue);
