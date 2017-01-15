import React from 'react';
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

    this.toggleRegistration = this.toggleRegistration.bind(this);
    this.userAdministration = this.userAdministration.bind(this);
    this.endGAM = this.endGAM.bind(this);
  }

  toggleRegistration() {
    this.props.toggleRegistration();
  }

  userAdministration() {
    // This should take you to the user administration
  }

  endGAM() {
    // This should close the general annual meeting.
  }

  render() {
    const registrationOpen = this.state.registrationOpen ?
      'Steng registrering' : 'Åpne registrering';

    return (
      <div className="AdminPanel">
        <Heading title="Generalforsamling adminpanel">
          <Button onClick={this.toggleRegistration}>{registrationOpen}</Button>
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

export default AdminPanel;
