import { createSelector } from 'reselect';
import arrayShuffle from 'array-shuffle';
import { getIssue } from '../issue/selectors';

export const getAlternatives = (state) => {
  const issue = getIssue(state);
  if (issue && issue.alternatives && issue.alternatives.length) {
    return issue.alternatives;
  }
  return [];
};

export const getShuffledAlternatives = createSelector(
  [getAlternatives],
  alternatives => arrayShuffle(alternatives),
);
