import React from 'react';
import { VoteStatusContainer } from './VoteStatus';
import '../css/IssueStatus.css';

const IssueStatus = () => (
  <div className="IssueStatus">
    <h2 className="IssueStatus-title">
      Foreløpig status
    </h2>
    <VoteStatusContainer />
  </div>
);

export default IssueStatus;
