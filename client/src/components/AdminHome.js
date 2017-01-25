import React from 'react';
import ActiveIssue from '../containers/ActiveIssue';
import AdminPanelAlternativesContainer from '../containers/AdminPanelAlternativesContainer';


const AdminHome = () => (
  <div>
    <ActiveIssue className="fefef" />
    <AdminPanelAlternativesContainer />
  </div>
);

export default AdminHome;
