import React from "react";
import LiveCount from "../LiveCount";
import Voting from "../Voting";
import ActiveIssue from  '../../containers/ActiveIssue';;


const App = () => {
  return (
    <div className="App">
      <ActiveIssue />
      <LiveCount voteCount="3" userCount="20"/>
      <Voting alternatives={["Donald Trump","Trump the Dump","The Trumpmeister",4]}/>
    </div>
  );
};

export default App;
