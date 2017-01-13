import React from "react";
import ActiveIssue from "../ActiveIssue";
import LiveCount from "../LiveCount";
import Voting from "../Voting";

const App = () => {
  return (
    <div className="App">
      <ActiveIssue issue="Hello world"/>
      <LiveCount voteCount="3" userCount="20"/>
      <Voting alternatives={["Donald Trump","Trump the Dump","The Trumpmeister",4]}/>
    </div>
  );
};

export default App;
