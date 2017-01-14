import React from 'react';
import LiveVoteCount from '../../containers/LiveVoteCount';
import VoteHandler from '../../containers/VoteHandler';
import ActiveIssue from '../../containers/ActiveIssue';

const App = () => (
  <div className="App">
    <ActiveIssue />
    <LiveVoteCount />
    <VoteHandler />
  </div>
  );

export default App;
