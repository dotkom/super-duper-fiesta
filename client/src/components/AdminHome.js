import React from 'react';
import AdminIssueContainer from '../containers/AdminIssueContainer';
import AdminPanelAlternativesContainer from '../containers/AdminPanelAlternativesContainer';
import ConcludedIssueListContainer from '../containers/ConcludedIssueListContainer';
import IssueStatus from './IssueStatus';


const AdminHome = () => (
  <div>
    <div className="ActiveIssue-components">
      <div className="ActiveIssue-Vote-wrapper">
        <AdminIssueContainer />
        <AdminPanelAlternativesContainer />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
