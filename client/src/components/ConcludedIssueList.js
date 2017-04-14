import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssues } from '../selectors/issues';

const ConcludedIssueList = ({ issues }) => (
  <div className={css.concludedIssueList}>
    {Object.keys(issues).map(issue => (
      <ConcludedIssue key={issues[issue].id} {...issues[issue]} />
    ))}
  </div>
);

ConcludedIssueList.propTypes = {
  issues: PropTypes.shape({}).isRequired,
};

export default ConcludedIssueList;
const mapStateToProps = state => ({
  issues: state.votingEnabled ?
    getConcludedIssues(state) : state.issues,
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
