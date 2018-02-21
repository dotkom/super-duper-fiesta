import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { IS_MANAGER } from 'common/auth/permissions';
import { endGAM, toggleRegistration } from 'features/meeting/actionCreators';
import { AdminHomeContainer } from './Home';
import { IssueFormContainer } from './IssueForm';
import Users from './Users';
import Button from '../Button';
import Dialog from '../Dialog';
import Heading from '../Heading';
import { ErrorContainer } from '../Error';
import NewVersionAvailable from '../NewVersionAvailable';
import NotFound from '../NotFound';
import { AdminLoginContainer } from './AdminLogin';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegistrationDialog: false,
      openRegistration: false,
      showEndGAMDialog: false,
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
      OfflinePluginRuntime.update();
    }
  }

  openRegistrationDialog() {
    this.setState({
      showRegistrationDialog: true,
    });
  }

  closeRegistrationDialog() {
    this.setState({
      showRegistrationDialog: false,
    });
  }

  confirmRegistrationDialog() {
    this.closeRegistrationDialog();
    this.props.toggleRegistration(this.props.registrationOpen);
  }

  endGAM() {
    this.props.endGAM();
  }

  render() {
    const { match, registrationOpen, userPermissions } = this.props;
    const permissionDenied = userPermissions < IS_MANAGER;
    const registrationText = registrationOpen ?
      'Steng registrering' : 'Åpne registrering';

    return (
      <div>
        <NewVersionAvailable
          newVersionAvailable={this.state.newVersionAvailable}
        />
        {permissionDenied || !this.props.meetingExists ?
          <Route component={AdminLoginContainer} /> :
          <div>
            <Dialog
              visible={this.state.showRegistrationDialog}
              onClose={(...a) => this.closeRegistrationDialog(...a)}
              title={registrationText}
              subtitle={`Bekreft ${registrationOpen ? 'lukking' : 'åpning'} av registrering.`}
            >
              <Button
                background
                onClick={(...a) => this.confirmRegistrationDialog(...a)}
              >Bekreft</Button>
              <Button
                background
                onClick={(...a) => this.closeRegistrationDialog(...a)}
              >Avbryt</Button>
            </Dialog>
            <Dialog
              visible={this.state.showEndGAMDialog}
              onClose={() => this.setState({ showEndGAMDialog: false })}
              title="Avslutt generalforsamling"
              subtitle="Bekreft avslutting av generalforsamling"
            >
              <Button
                background
                onClick={() => this.endGAM()}
              >Bekreft</Button>
              <Button
                background
                onClick={() => this.setState({ showEndGAMDialog: false })}
              >Avbryt</Button>
            </Dialog>
            <Heading link="/admin/" title="Generalforsamling adminpanel">
              <Link to="/admin/question"><Button>Ny sak</Button></Link>
              <Button
                onClick={(...a) => this.openRegistrationDialog(...a)}
              >{registrationText}</Button>
              <Link to="/admin/users"><Button>Brukeradmin</Button></Link>
              <Button onClick={() => this.setState({ showEndGAMDialog: true })}>Avslutt</Button>
            </Heading>
            <main>
              <ErrorContainer />
              <Switch>
                <Route exact path={`${match.path}/question`} component={IssueFormContainer} />
                <Route exact path={`${match.path}/users`} component={Users} />
                <Route exact path={match.path} component={AdminHomeContainer} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>}
      </div>
    );
  }
}

AdminPanel.defaultProps = {
  registrationOpen: false,
  meetingExists: false,
};

AdminPanel.propTypes = {
  endGAM: PropTypes.func.isRequired,
  registrationOpen: PropTypes.bool,
  toggleRegistration: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  meetingExists: PropTypes.bool,
  userPermissions: PropTypes.number.isRequired,
  version: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  meetingExists: state.meeting &&
                 state.meeting.title &&
                 state.meeting.title !== '' &&
                 state.meeting.title.length > 0,
  registrationOpen: state.meeting.registrationOpen,
  userPermissions: state.auth.permissions,
  version: state.version,
});

const mapDispatchToProps = dispatch => ({
  endGAM: () => {
    dispatch(endGAM());
  },
  toggleRegistration: (registrationOpen) => {
    dispatch(toggleRegistration(registrationOpen));
  },
});


export default AdminPanel;
export const AdminPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
