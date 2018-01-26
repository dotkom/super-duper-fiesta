import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConcludedIssue from '../ConcludedIssue';
import { getLatestConcludedIssue } from '../../features/issue/selectors';

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

LatestConcludedIssue.propTypes = {
  issue: PropTypes.shape(ConcludedIssue.propTypes).isRequired,
};

const mapStateToProps = state => ({
  issue: getLatestConcludedIssue(state),
});

export default connect(mapStateToProps)(LatestConcludedIssue);
