import React from 'react';
import { IssueAdminContainer } from './IssueAdmin';
import Alternatives from './Alternatives';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import IssueStatus from '../IssueStatus';


const AdminHome = () => (
  <div>
    <div className="ActiveIssue-components">
      <div className="ActiveIssue-Vote-wrapper">
        <IssueAdminContainer />
        <Alternatives />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
