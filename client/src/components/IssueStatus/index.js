import React from 'react';
import { VoteStatusContainer } from './VoteStatus';
import LastVotes from './LastVotes';
import Card from '../Card';
import css from './IssueStatus.css';

const IssueStatus = () => (
  <Card classes={css.status} subtitle="Foreløpig status">
    <VoteStatusContainer />
    <LastVotes />
  </Card>
);

export default IssueStatus;
