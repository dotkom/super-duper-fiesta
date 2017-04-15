import React from 'react';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from './Issue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import css from '../../css/Home.css';

const Home = () => (
  <div>
    <div className={css.components}>
      <div className={css.voteWrapper}>
        <IssueContainer />
        <VotingMenuContainer />
      </div>
      <IssueStatus />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

export default Home;
