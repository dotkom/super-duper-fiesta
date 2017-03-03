export const getIssue = state =>
   // There might not be any issues yet.
  state.issues.length && state.issues[state.issues.length - 1];

export const getIssueText = state => getIssue(state) ? getIssue(state).text : 'Ingen aktiv sak for øyeblikket.';
