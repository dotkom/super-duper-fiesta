import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLatestConcludedIssue } from 'features/issue/selectors';
import ConcludedIssue from '../ConcludedIssue';

const LatestConcludedIssue = ({ issue }) => {
  if (!issue) {
    return null;
  }
  return (
    <ConcludedIssue
      key={issue.id}
      majority={issue.winner !== null}
      {...issue}
    />
  );
};

LatestConcludedIssue.defaultProps = {
  issue: null,
};

LatestConcludedIssue.propTypes = {
  issue: PropTypes.shape(ConcludedIssue.propTypes),
};

const mapStateToProps = state => ({
  issue: getLatestConcludedIssue(state),
});

export default connect(mapStateToProps)(LatestConcludedIssue);
