import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { adminCreateGenfors, adminLogin } from '../../actionCreators/auth';
import Button from '../Button';
import { ErrorContainer } from '../Error';
import Heading from '../Heading';


class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      password: '',
      title: '',
    };
  }

  authenticateAdmin(e) {
    e.preventDefault();
    if (this.props.meetingExists) {
      this.props.login(this.state.password);
    } else {
      this.props.createGenfors(this.state.password, this.state.title, this.state.date);
    }
  }

  render() {
    const date = new Date(this.state.date);
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
            {this.props.meetingExists
              ? <p>Vennligst logg inn for å få tilgang til denne funksjonaliteten.</p>
              : <p>Vennligst opprett en generalforsamling</p>}
            <form action="">
              {!this.props.meetingExists &&
              (<div>
                <input
                  type="text"
                  placeholder="Tittel"
                  value={this.state.title}
                  onChange={e => this.setState({ title: e.target.value })}
                />
                <input
                  type="date"
                  value={formattedDate}
                  onChange={e => this.setState({ date: new Date(e.target.value) })}
                />
              </div>
              )}
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

AdminLogin.propTypes = {
  createGenfors: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  meetingExists: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  meetingExists: state.meeting &&
                 state.meeting.title &&
                 state.meeting.title !== '' &&
                 state.meeting.title.length > 0,
});

const mapDispatchToProps = dispatch => ({
  login: (password) => {
    dispatch(adminLogin(password));
  },
  createGenfors: (password, title, date) => {
    dispatch(adminCreateGenfors(password, title, date));
  },
});

AdminLogin.propTypes = {
  login: React.PropTypes.func.isRequired,
};

export default AdminLogin;
export const AdminLoginContainer = connect(mapStateToProps,
                                           mapDispatchToProps)(AdminLogin);
