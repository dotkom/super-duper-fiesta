import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import Heading from '../Heading';
import { ErrorContainer } from '../Error';

const App = props => (
  <div className="App">
    <Heading link="/" title={props.title}>
      <span>{props.fullName}</span>
      <a href={props.loggedIn ? '/logout' : '/login'}>
        <Button>Logg {props.loggedIn ? 'ut' : 'inn'}</Button>
      </a>
    </Heading>
    <main>
      <ErrorContainer />
      {props.children}
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
  children: PropTypes.node.isRequired,
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
