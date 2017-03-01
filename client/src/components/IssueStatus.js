import React from 'react';
import LiveVoteCount from '../containers/LiveVoteCount';
import '../css/IssueStatus.css';

const IssueStatus = () => (
  <div className="IssueStatus">
    <h2 className="IssueStatus-title">
      Foreløpig status
    </h2>
    <LiveVoteCount />
  </div>
);

export default IssueStatus;
