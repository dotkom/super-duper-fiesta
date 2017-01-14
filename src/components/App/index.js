import React from 'react';
import LiveCount from '../LiveCount';
import VoteHandler from '../../containers/VoteHandler';
import ActiveIssue from '../../containers/ActiveIssue';


const App = () => (
  <div className="App">
    <ActiveIssue />
    <LiveCount voteCount={3} userCount={20} />
    <VoteHandler />
  </div>
  );

export default App;
