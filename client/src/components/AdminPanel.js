import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Button from './Button';
import Heading from './Heading';
import '../css/AdminPanel.css';
import Dialog from './Dialog';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegistrationDialog: false,
      openRegistration: false,
    };

    this.endGAM = this.endGAM.bind(this);
    this.closeRegistrationDialog = this.closeRegistrationDialog.bind(this);
    this.openRegistrationDialog = this.openRegistrationDialog.bind(this);
    this.confirmRegistrationDialog = this.confirmRegistrationDialog.bind(this);
  }

  endGAM() {
    // This should close the general annual meeting.
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
    this.props.toggleRegistration();
  }

  render() {
    const { registrationEnabled } = this.props;
    const registrationText = registrationEnabled ?
      'Steng registrering' : 'Åpne registrering';

    return (
      <div className="AdminPanel">
        <Dialog visible={this.state.showRegistrationDialog} onClose={this.closeRegistrationDialog} title={registrationText}>
          <p>Er du sikker? *Skriv noe mer fornuftig her*</p>
          <Button onClick={this.confirmRegistrationDialog}>Bekreft</Button>
          <Button onClick={this.closeRegistrationDialog}>Avbryt</Button>
        </Dialog>
        <Heading link="/admin/" title="Generalforsamling adminpanel">
          <Button onClick={this.props.createIssue}>Click</Button>
          <Button onClick={this.openRegistrationDialog}>{registrationText}</Button>
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
