import React from 'react';

class AdminPanel extends React.Component {
  constructor() {
    super();

    this.state = {
      userRegistration: false,
    };

    this.toggleRegistration = this.toggleRegistration.bind(this);
    this.userAdministration = this.userAdministration.bind(this);
    this.endGAM = this.endGAM.bind(this);
  }

  toggleRegistration() {
    this.setState({
      openRegistration: !this.state.openRegistration,
    });
  }

  userAdministration() {
    // This should take you to the user administration
  }

  endGAM() {
    // This should close the general annual meeting.
  }

  render() {
    const registrationOpen = this.state.registrationOpen ?
      'Registreringen åpen' : 'Registrering lukket';

    return (
      <div className="AdminPanel">
        <h2> Admin panel </h2>
        <div className="MeetingAdmin">
          <button onChange={this.toggleRegistration}>{registrationOpen}</button>
          <button onChange={this.userAdministration}>Brukeradministrasjon</button>
          <button onChange={this.endGAM}>Avslutt generalforsamling</button>
        </div>
        <div className="CurrentIssue">

        </div>
      </div>
    );
  }
}
