import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import AdminHome from './Home';
import { IssueFormContainer } from './IssueForm';
import Users from './Users';
import Button from '../Button';
import Dialog from '../Dialog';
import Heading from '../Heading';
import { ErrorContainer } from '../Error';
import { toggleRegistration } from '../../actionCreators/meeting';
import { IS_MANAGER } from '../../../../common/auth/permissions';
import NotFound from '../NotFound';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegistrationDialog: false,
      openRegistration: false,
    };
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

  render() {
    const { match, registrationOpen, userPermissions } = this.props;
    const permissionDenied = userPermissions < IS_MANAGER;
    const registrationText = registrationOpen ?
      'Steng registrering' : 'Åpne registrering';

    return (
      <div>
        {permissionDenied ?
          <Route component={NotFound} /> :
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
            <Heading link="/admin/" title="Generalforsamling adminpanel">
              <Link to="/admin/question"><Button>Ny sak</Button></Link>
              <Button
                onClick={(...a) => this.openRegistrationDialog(...a)}
              >{registrationText}</Button>
              <Link to="/admin/users"><Button>Brukeradmin</Button></Link>
              <Button onClick={(...a) => this.endGAM(...a)}>Avslutt</Button>
            </Heading>
            <main>
              <ErrorContainer />
              <Switch>
                <Route exact path={`${match.path}/question`} component={IssueFormContainer} />
                <Route exact path={`${match.path}/users`} component={Users} />
                <Route exact path={match.path} component={AdminHome} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>}
      </div>
    );
  }
}

AdminPanel.propTypes = {
  registrationOpen: PropTypes.bool.isRequired,
  toggleRegistration: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
  })).isRequired,
  userPermissions: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  registrationOpen: state.meeting.registrationOpen,
  userPermissions: state.auth.permissions,
});

const mapDispatchToProps = dispatch => ({
  toggleRegistration: (registrationOpen) => {
    dispatch(toggleRegistration(registrationOpen));
  },
});


export default AdminPanel;
export const AdminPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
