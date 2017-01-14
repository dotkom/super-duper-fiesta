import React from 'react';
import LiveCount from '../LiveCount';
import VoteHandler from '../../containers/VoteHandler';
import ActiveIssue from '../../containers/ActiveIssue';
import Heading from '../Heading';

const App = () => (
  <div className="App">
    <Heading />
    <ActiveIssue />
    <LiveCount voteCount={3} userCount={20} />
    <VoteHandler />
  </div>
  );

export default App;
