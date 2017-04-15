import React from 'react';
import { VoteStatusContainer } from './VoteStatus';
import Card from './Card';
import css from './IssueStatus.css';

const IssueStatus = () => (
  <Card classes={css.status} subtitle="Foreløpig status">
    <VoteStatusContainer />
  </Card>
);

export default IssueStatus;
