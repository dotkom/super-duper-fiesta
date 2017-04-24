import React, { PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { HomeContainer as AppHomeContainer } from './Home';
import { SetupContainer } from './Setup';
import Button from '../Button';
import Heading from '../Heading';
import NewVersionAvailable from '../NewVersionAvailable';
import { ErrorContainer } from '../Error';
import NotFound from '../NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersionAvailable: false,
      currentVersion: props.version,
    };
  }

  componentWillReceiveProps(nextProps) {
    // If no version stored in state, store the incoming version.
    if (this.state && !this.state.currentVersion.length) {
      this.setState({
        currentVersion: nextProps.version,
      });
    } else if (this.state.currentVersion !== nextProps.version) {
      this.setState({ newVersionAvailable: true });
    }
  }

  render() {
    const { fullName, loggedIn, title, match } = this.props;
    const { newVersionAvailable } = this.state;
    return (
      <div>
        <Heading link="/" title={title}>
          <span>{fullName}</span>
          <a href={loggedIn ? '/logout' : '/login'}>
            <Button>Logg {loggedIn ? 'ut' : 'inn'}</Button>
          </a>
        </Heading>
        <main>
          <NewVersionAvailable newVersionAvailable={newVersionAvailable} />
          <ErrorContainer />
          <Switch>
            <Route exact path={`${match.path}register`} component={SetupContainer} />
            <Route exact path={match.path} component={AppHomeContainer} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    );
  }
}

App.defaultProps = {
  fullName: '',
  loggedIn: false,
  title: 'Super Duper Fiesta : Ingen aktiv generalforsamling',
  match: null,
  version: '',
};

App.propTypes = {
  fullName: PropTypes.string,
  loggedIn: PropTypes.bool,
  title: PropTypes.string,
  match: PropTypes.objectOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
  })).isRequired,
  version: PropTypes.string,
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName,
  loggedIn: state.auth.loggedIn,
  title: state.meeting.title,
  version: state.version,
});

export default App;
export const AppContainer = connect(
  mapStateToProps,
)(App);
