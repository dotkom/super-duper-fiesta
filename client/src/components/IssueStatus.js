import React from 'react';
import { VoteStatusContainer } from './VoteStatus';
import Card from './Card';
import '../css/IssueStatus.css';

const IssueStatus = () => (
  <Card classes="IssueStatus" subtitle="Foreløpig status">
    <VoteStatusContainer />
  </Card>
);

export default IssueStatus;
