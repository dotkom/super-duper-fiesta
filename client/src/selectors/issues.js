export const getIssue = state =>
   // There might not be any issues yet.
  state.issues.filter(issue => issue.active) ? state.issues.filter(issue => issue.active)[0] : {};

export const getIssueText = state => getIssue(state) ? getIssue(state).text : 'Ingen aktiv sak for øyeblikket.';
