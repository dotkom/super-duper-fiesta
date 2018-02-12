import React from 'react';
import PropTypes from 'prop-types';
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
    votes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  concludedIssueListEnabled: PropTypes.bool.isRequired,
};

export default ConcludedIssueList;

const mapStateToProps = state => ({
  issues: getConcludedIssuesExceptLatest(state),
  concludedIssueListEnabled: concludedIssueListIsEnabled(state),
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
