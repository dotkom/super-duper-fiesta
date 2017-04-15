import React from 'react';
import { IssueContainer } from './Issue';
import Alternatives from './Alternatives';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import IssueStatus from '../IssueStatus';
import css from '../../css/Home.css';


const AdminHome = () => (
  <div>
    <div className={css.components}>
      <div className={css.voteWrapper}>
        <IssueContainer />
        <Alternatives disabled />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default AdminHome;
