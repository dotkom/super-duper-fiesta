import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Button from '../Button';
import Dialog from '../Dialog';
import Heading from '../Heading';
import { toggleRegistration } from '../../actionCreators/adminButtons';
import '../../css/AdminPanel.css';

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
          <Button background onClick={this.confirmRegistrationDialog}>Bekreft</Button>
          <Button background onClick={this.closeRegistrationDialog}>Avbryt</Button>
        </Dialog>
        <Heading link="/admin/" title="Generalforsamling adminpanel">
          <Link to="/admin/question"><Button>Ny sak</Button></Link>
          <Button onClick={this.openRegistrationDialog}>{registrationText}</Button>
          <Link to="/admin/users"><Button>Brukeradmin</Button></Link>
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
  registrationEnabled: PropTypes.bool.isRequired,
  toggleRegistration: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = ({ registrationEnabled }) => ({
  registrationEnabled,
});

const mapDispatchToProps = dispatch => ({
  toggleRegistration: () => {
    dispatch(toggleRegistration());
  },
});


export default AdminPanel;
export const AdminPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
