import React from 'react';
import LiveVoteCount from '../containers/LiveVoteCount';
import VoteHandler from '../containers/VoteHandler';
import ActiveIssue from '../containers/ActiveIssue';
import Button from './Button';
import Heading from './Heading';
import ConcludedIssueListContainer from '../containers/ConcludedIssueListContainer';
import '../css/App.css';

const App = () => (
  <div className="App">
    <Heading link="/" title="Onlines generalforsamling 2017">
      <Button>Logg out</Button>
    </Heading>
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
