import React from 'react';
import LiveCount from '../LiveCount';
import Voting from '../VotingMenu';
import ActiveIssue from '../../containers/ActiveIssue';


const App = () => (
  <div className="App">
    <ActiveIssue />
    <LiveCount voteCount="3" userCount="20" />
    <Voting alternatives={[{ text: 'Donald Trump', id: 0 }, { text: 'Donald Duck', id: 1 }]} />
  </div>
  );

export default App;
