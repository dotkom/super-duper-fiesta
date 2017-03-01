import { createSelector } from 'reselect';
import arrayShuffle from 'array-shuffle';

const getAlternatives = state => (
  state.issues.length ? state.issues[state.issues.length - 1].alternatives : []
);

export default createSelector(
  [getAlternatives],
  alternatives => arrayShuffle(alternatives),
);
