import React from 'react';
import AdminIssueContainer from '../containers/AdminIssueContainer';
import AdminPanelAlternativesContainer from '../containers/AdminPanelAlternativesContainer';
import ConcludedIssueListContainer from '../containers/ConcludedIssueListContainer';
import IssueStatus from './IssueStatus';
import Pin from './Pin';


const AdminHome = () => (
  <div>
    <div className="ActiveIssue-components">
      <div className="ActiveIssue-Vote-wrapper">
        <Pin code="DEADBEEF" />
        <AdminIssueContainer />
        <AdminPanelAlternativesContainer />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
