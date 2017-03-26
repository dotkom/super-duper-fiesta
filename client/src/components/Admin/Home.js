import React from 'react';
import { IssueContainer } from './Issue';
import Alternatives from './Alternatives';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import IssueStatus from '../IssueStatus';


const AdminHome = () => (
  <div>
    <div className="ActiveIssue-components">
      <div className="ActiveIssue-Vote-wrapper">
        <IssueContainer />
        <Alternatives disabled />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
