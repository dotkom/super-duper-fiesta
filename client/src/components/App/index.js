import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from './Issue';
import Button from '../Button';
import Heading from '../Heading';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import '../../css/App.css';
import '../../css/Button.css';
import '../../css/flaticon.css';

const App = props => (
  <div className="App">
    <Heading link="/" title={props.title}>
      <span>{props.fullName}</span>
      <a href={props.loggedIn ? '/logout' : '/login'}>
        <Button>Logg {props.loggedIn ? 'ut' : 'inn'}</Button>
      </a>
    </Heading>
    <main>
      <div className="ActiveIssue-components">
        <div className="ActiveIssue-Vote-wrapper">
          <IssueContainer />
          <VotingMenuContainer loggedIn={props.loggedIn} />
        </div>
        <IssueStatus />
      </div>
      <ConcludedIssueListContainer />
    </main>
  </div>
  );

App.defaultProps = {
  fullName: '',
  loggedIn: false,
  title: 'Super Duper Fiesta : Ingen aktiv generalforsamling',
};

App.propTypes = {
  fullName: PropTypes.string,
  loggedIn: PropTypes.bool,
  title: PropTypes.string,
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName,
  loggedIn: state.auth.loggedIn,
  title: state.meeting.title,
});

export default App;
export const AppContainer = connect(
  mapStateToProps,
)(App);
