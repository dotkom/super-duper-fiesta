import { createSelector } from 'reselect';
import arrayShuffle from 'array-shuffle';
import { getIssue } from './issues';

const getAlternatives = (state) => {
  const issue = getIssue(state);
  if (issue && issue.alternatives && issue.alternatives.length) {
    return issue.alternatives;
  }
  return [];
};

export default createSelector(
  [getAlternatives],
  alternatives => arrayShuffle(alternatives),
);
