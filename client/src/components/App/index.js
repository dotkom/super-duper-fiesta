import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import Heading from '../Heading';
import NewVersionAvailable from '../NewVersionAvailable';
import { ErrorContainer } from '../Error';

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
    const { children, fullName, loggedIn, title } = this.props;
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
          {children}
        </main>
      </div>
    );
  }
}

App.defaultProps = {
  fullName: '',
  loggedIn: false,
  title: 'Super Duper Fiesta : Ingen aktiv generalforsamling',
  version: '',
};

App.propTypes = {
  fullName: PropTypes.string,
  loggedIn: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
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
