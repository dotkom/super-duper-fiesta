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
        <Dialog visible={this.state.showRegistrationDialog} onClose={(...a) => this.closeRegistrationDialog(...a)} title={registrationText}>
          <p>Er du sikker? *Skriv noe mer fornuftig her*</p>
          <Button background onClick={(...a) => this.confirmRegistrationDialog(...a)}>Bekreft</Button>
          <Button background onClick={(...a) => this.closeRegistrationDialog(...a)}>Avbryt</Button>
        </Dialog>
        <Heading link="/admin/" title="Generalforsamling adminpanel">
          <Link to="/admin/question"><Button>Ny sak</Button></Link>
          <Button onClick={(...a) => this.openRegistrationDialog(...a)}>{registrationText}</Button>
          <Link to="/admin/users"><Button>Brukeradmin</Button></Link>
          <Button onClick={(...a) => this.endGAM(...a)}>Avslutt</Button>
        </Heading>
        <main>
          {this.props.children}
        </main>
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
