import React from 'react';
import DocumentTitle from 'react-document-title';
import { IssueContainer } from './Issue';
import Alternatives from './Alternatives';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import UserSettings from '../UserSettings';
import IssueStatus from '../IssueStatus';
import css from '../../css/Home.css';


const AdminHome = () => (
  <DocumentTitle title="Generalforsamling adminpanel">
    <div>
      <div className={css.components}>
        <div className={css.voteWrapper}>
          <IssueContainer />
          <Alternatives disabled />
        </div>
        <IssueStatus />
      </div>
      <UserSettings />
      <ConcludedIssueListContainer />
    </div>
  </DocumentTitle>
);

export default AdminHome;
