import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Button from './Button';
import Heading from './Heading';
import '../css/AdminPanel.css';

import createIssue from '../actions/adminButtons';

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
        <Heading link="/admin/" title="Generalforsamling adminpanel">
          <Button onClick={this.props.createIssue}>Click</Button>
          <Button onClick={toggleRegistration}>{registrationText}</Button>
          <Link to="/admin/users"><Button onClick={this.userAdministration}>Brukeradmin</Button></Link>
          <Button onClick={this.endGAM}>Avslutt</Button>
        </Heading>
        <div className="AdminPanel-components">
          {this.props.children}
        </div>
      </div>
    );
  }
}

AdminPanel.propTypes = {
  createIssue: PropTypes.func.isRequired,
  registrationEnabled: PropTypes.bool.isRequired,
  toggleRegistration: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AdminPanel;
