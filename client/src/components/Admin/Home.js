import React from 'react';
import { IssueAdminContainer } from './IssueAdmin';
import Alternatives from './Alternatives';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import IssueStatus from '../IssueStatus';
import Pin from './Pin';


const AdminHome = () => (
  <div>
    <div className="ActiveIssue-components">
      <div className="ActiveIssue-Vote-wrapper">
        <Pin code="DEADBEEF" />
        <IssueAdminContainer />
        <Alternatives />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
