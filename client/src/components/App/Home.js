import React from 'react';
import IssueStatus from '../IssueStatus';
import { IssueContainer } from './Issue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';

const Home = () => (
  <div>
    <div className="ActiveIssue-components">
      <IssueContainer />
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default Home;
