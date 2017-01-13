import React from "react";
import ActiveIssue from "../ActiveIssue";
import LiveCount from "../LiveCount";

const App = () => {
  return (
    <div className="App">
      <ActiveIssue issue="Hello world"/>
      <LiveCount voteCount="3" userCount="20"/>
    </div>
  );
};

export default App;
