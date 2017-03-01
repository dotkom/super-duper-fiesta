export const getIssue = state => (
  state.issues.length ? // Issues may not be added yet.
  state.issues[state.issues.length - 1] :
  undefined
);
