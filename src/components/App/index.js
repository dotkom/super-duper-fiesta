import React from 'react';
import ActiveIssue from  '../../containers/ActiveIssue';;
import LiveCount from '../LiveCount';

const App = () => {
  return (
    <div className="App">
      <ActiveIssue />
      <LiveCount voteCount="3" userCount="20"/>
    </div>
  );
};

export default App;
