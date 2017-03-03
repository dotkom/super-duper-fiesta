export const getIssue = (state) => {
  if (!state || (state && !Object.keys(state.issues).length)) {
    return {};
  }
  // Gets the current active issue after iterating over all issues and finding the one with "active == true"
  return state.issues[Object.keys(state.issues)
    .filter(issueId => state.issues[issueId].active)[0]];
};

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
