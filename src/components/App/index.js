import React from 'react';
import LiveVoteCount from '../../containers/LiveVoteCount';
import VoteHandler from '../../containers/VoteHandler';
import ActiveIssue from '../../containers/ActiveIssue';
import Heading from '../Heading';

const App = () => (
  <div className="App">
    <Heading />
    <ActiveIssue />
    <LiveVoteCount />
    <VoteHandler />
  </div>
  );

export default App;
