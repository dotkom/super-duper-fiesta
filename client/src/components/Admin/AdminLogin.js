import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { adminLogin } from '../../actionCreators/auth';
import Button from '../Button';
import { ErrorContainer } from '../Error';
import Heading from '../Heading';


class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  authenticateAdmin(e) {
    e.preventDefault();
    this.props.login(this.state.password);
  }

  render() {
    return (
      <div>
        <div>
          <Heading link="/" title="Administrasjon">
            <Link to="/">
              <Button>Gå tilbake</Button>
            </Link>
          </Heading>
          <main>
            <ErrorContainer />
            <h1>Logg inn</h1>
            <p>Vennligst logg inn for å få tilgang til denne funksjonaliteten.</p>
            <form action="">
              <input
                type="password"
                placeholder="Administratorpassord"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
              <Button
                background
                onClick={e => this.authenticateAdmin(e)}
              >
                Logg inn
              </Button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: (password) => {
    dispatch(adminLogin(password));
  },
});

AdminLogin.propTypes = {
  login: React.PropTypes.func.isRequired,
};

export default AdminLogin;
export const AdminLoginContainer = connect(null, mapDispatchToProps)(AdminLogin);
