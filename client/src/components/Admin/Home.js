import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { VOTING_FINISHED } from 'common/actionTypes/issues';
import Issue from '../App/Issue';
import { IssueContainer } from './Issue';
import Alternatives from './Alternatives';
import ConcludedIssue from '../ConcludedIssue';
import LatestConcludedIssue from '../LatestConcludedIssue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import UserSettings from '../UserSettings';
import IssueStatus from '../IssueStatus';
import { getIssue } from '../../features/issue/selectors';
import css from '../../css/Home.css';


const AdminHome = ({ issue }) => (
  <DocumentTitle title="Generalforsamling adminpanel">
    <div>
      <div className={css.components}>
        <div className={css.voteWrapper}>
          <IssueContainer />
          <Alternatives disabled />
        </div>
        <IssueStatus />
      </div>
      {(issue && issue.status === VOTING_FINISHED) && <ConcludedIssue
        {...issue}
      />}
      <div className={css.components}>
        <div className={css.latestIssue}>
          <LatestConcludedIssue />
        </div>
        <UserSettings />
      </div>
      <ConcludedIssueListContainer />
    </div>
  </DocumentTitle>
);

AdminHome.defaultProps = {
  issue: Issue.defaultProps,
};

AdminHome.propTypes = {
  issue: PropTypes.shape(Issue.propTypes),
};

const mapStateToProps = state => ({
  issue: getIssue(state),
});

export default AdminHome;
export const AdminHomeContainer = connect(
  mapStateToProps,
)(AdminHome);
