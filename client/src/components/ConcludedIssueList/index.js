import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getConcludedIssuesExceptLatest } from 'features/issue/selectors';
import { concludedIssueListIsEnabled } from 'features/userSettings/selectors';
import ConcludedIssue from '../ConcludedIssue';
import css from './ConcludedIssueList.css';

function ConcludedIssueList({ concludedIssueListEnabled, issues }) {
  return (
    <div>
      <div className={css.concludedIssueList}>
        {concludedIssueListEnabled && Object.keys(issues)
          .map(issue => (
            <ConcludedIssue
              key={issues[issue].id}
              {...issues[issue]}
            />
          ))}
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
