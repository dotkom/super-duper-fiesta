import React, { PropTypes } from 'react';
import ActiveIssue from '../containers/ActiveIssue';
import AdminPanelAlternativesContainer from '../containers/AdminPanelAlternativesContainer';
import Button from './Button';
import Heading from './Heading';
import '../css/AdminPanel.css';

class AdminPanel extends React.Component {
  constructor() {
    super();

    this.state = {
      openRegistration: false,
    };

    this.userAdministration = this.userAdministration.bind(this);
    this.endGAM = this.endGAM.bind(this);
  }

  userAdministration() {
    // This should take you to the user administration
  }

  endGAM() {
    // This should close the general annual meeting.
  }

  render() {
    const { registrationEnabled, toggleRegistration } = this.props;
    const registrationText = registrationEnabled ?
      'Steng registrering' : 'Åpne registrering';

    return (
      <div className="AdminPanel">
        <Heading title="Generalforsamling adminpanel">
          <Button onClick={toggleRegistration}>{registrationText}</Button>
          <Button onClick={this.userAdministration}>Brukeradmin</Button>
          <Button onClick={this.endGAM}>Avslutt</Button>
        </Heading>
        <div className="AdminPanel-components">
          <ActiveIssue className="fefef" />
          <AdminPanelAlternativesContainer />
        </div>
      </div>
    );
  }
}

AdminPanel.propTypes = {
  registrationEnabled: PropTypes.bool.isRequired,
  toggleRegistration: PropTypes.func.isRequired,
};

export default AdminPanel;
