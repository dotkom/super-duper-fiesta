import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from '../Issue';
import Button from '../Button';
import Heading from '../Heading';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import '../../css/App.css';
import '../../css/flaticon.css';

const App = props => (
  <div className="App">
    <Heading link="/" title={props.title}>
      <Button>Logg ut</Button>
    </Heading>
    <div className="App-components">
      <div className="ActiveIssue-components">
        <div className="ActiveIssue-Vote-wrapper">
          <IssueContainer />
          <VotingMenuContainer />
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

const mapStateToProps = state => ({
  title: state.meeting.title,
});

export default App;
export const AppContainer = connect(
  mapStateToProps,
)(App);
