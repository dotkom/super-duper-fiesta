import React from 'react';
import LiveVoteCount from '../../containers/LiveVoteCount';
import VoteHandler from '../../containers/VoteHandler';
import ActiveIssue from '../../containers/ActiveIssue';
import Heading from '../Heading';
import ConcludedIssueListContainer from '../../containers/ConcludedIssueListContainer';
import './App.css';

const App = () => (
  <div className="App">
    <Heading />
    <div className="App-components">
      <div className="ActiveIssue-components">
        <div className="ActiveIssue-Vote-wrapper">
          <ActiveIssue />
          <VoteHandler />
        </div>
        <LiveVoteCount />
      </div>
      <ConcludedIssueListContainer />
    </div>
  </div>
  );

export default App;
