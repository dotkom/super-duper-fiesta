import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssues } from '../selectors/issues';

// Maps over alternatives to see if any of them got majority vote
const calculateMajority = (alternatives, votes, voteDemand) => {
  const numTotalVotes = Object.keys(votes).length;
  return alternatives.some(alternative => Object.keys(votes)
    .map(key => votes[key])
    .filter(vote => vote.alternative === alternative.id)
    .length / numTotalVotes >= voteDemand,
  );
};

const ConcludedIssueList = ({ issues }) => (
  <div className={css.concludedIssueList}>
    {Object.keys(issues).map(issue => (
      <ConcludedIssue
        key={issues[issue].id}
        majority={calculateMajority(
          issues[issue].alternatives,
          issues[issue].votes,
          issues[issue].voteDemand,
        )}
        {...issues[issue]}
      />
    ))}
  </div>
);

ConcludedIssueList.propTypes = {
  issues: PropTypes.shape({
    votes: React.PropTypes.objectOf(React.PropTypes.string),
  }).isRequired,
};

export default ConcludedIssueList;

const mapStateToProps = state => ({
  issues: state.votingEnabled ?
    getConcludedIssues(state) : state.issues,
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
