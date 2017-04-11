import React from 'react';
import { VoteStatusContainer } from './VoteStatus';
import '../css/IssueStatus.css';

const IssueStatus = () => (
  <div className="IssueStatus">
    <p className="IssueStatus-title">
      Foreløpig status
    </p>
    <VoteStatusContainer />
  </div>
);

export default IssueStatus;
