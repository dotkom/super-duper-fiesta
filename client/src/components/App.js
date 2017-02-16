import React, { PropTypes } from 'react';
import IssueStatus from './IssueStatus';
import VoteHandler from '../containers/VoteHandler';
import ActiveIssue from '../containers/ActiveIssue';
import Button from './Button';
import Heading from './Heading';
import ConcludedIssueListContainer from '../containers/ConcludedIssueListContainer';
import '../css/App.css';

const App = props => (
  <div className="App">
    <Heading link="/" title={props.title}>
      <Button>Logg out</Button>
    </Heading>
    <div className="App-components">
      <div className="ActiveIssue-components">
        <div className="ActiveIssue-Vote-wrapper">
          <ActiveIssue />
          <VoteHandler />
        </div>
        <IssueStatus />
      </div>
      <ConcludedIssueListContainer />
    </div>
  </div>
  );

App.defaultProps = {
  title: 'Super Duper Fiesta : Ingen aktiv generalforsamling',
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
