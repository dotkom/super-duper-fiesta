import React from 'react';
import ActiveIssue from '../ActiveIssue';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ActiveIssue issue="Hello world" />
      </div>
    );
  }
}

export default App;
