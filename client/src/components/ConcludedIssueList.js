import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssuesExceptLatest } from '../selectors/issues';
import { concludedIssueListIsEnabled } from '../selectors/userSettings';

function ConcludedIssueList({ concludedIssueListEnabled, issues }) {
  return (
    <div>
      <div className={css.concludedIssueList}>
        {concludedIssueListEnabled && Object.keys(issues)
          .map((issue) => {
            const winner = issues[issue].winner;
            const majority = winner !== null;
            return (<ConcludedIssue
              key={issues[issue].id}
              majority={majority}
              {...issues[issue]}
            />);
          })}
      </div>
    </div>
  );
}

ConcludedIssueList.propTypes = {
  issues: PropTypes.shape({
    votes: React.PropTypes.objectOf(React.PropTypes.string),
  }).isRequired,
  concludedIssueListEnabled: React.PropTypes.bool.isRequired,
};

export default ConcludedIssueList;

const mapStateToProps = state => ({
  issues: getConcludedIssuesExceptLatest(state),
  concludedIssueListEnabled: concludedIssueListIsEnabled(state),
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
