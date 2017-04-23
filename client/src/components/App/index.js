import React, { PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { HomeContainer as AppHomeContainer } from './Home';
import { SetupContainer } from './Setup';
import Button from '../Button';
import Heading from '../Heading';
import { ErrorContainer } from '../Error';
import NotFound from '../NotFound';


const App = props => (
  <div>
    <Heading link="/" title={props.title}>
      <span>{props.fullName}</span>
      <a href={props.loggedIn ? '/logout' : '/login'}>
        <Button>Logg {props.loggedIn ? 'ut' : 'inn'}</Button>
      </a>
    </Heading>
    <main>
      <ErrorContainer />
      <Switch>
        <Route exact path={`${props.match.path}register`} component={SetupContainer} />
        <Route exact path={props.match.path} component={AppHomeContainer} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </div>
  );

App.defaultProps = {
  fullName: '',
  loggedIn: false,
  title: 'Super Duper Fiesta : Ingen aktiv generalforsamling',
  match: null,
};

App.propTypes = {
  fullName: PropTypes.string,
  loggedIn: PropTypes.bool,
  title: PropTypes.string,
  match: PropTypes.objectOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
  })).isRequired,
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
