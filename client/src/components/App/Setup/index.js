import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SHA256 from 'crypto-js/sha256';
import DocumentTitle from 'react-document-title';
import { register } from 'features/auth/actionCreators';
import Button from '../../Button';
import Card from '../../Card';
import css from './Setup.css';

class Setup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateCode: '',
      repeatPrivateCode: '',
      pin: '',
    };
  }

  changePrivateCode(e) {
    this.setState({
      privateCode: e.target.value,
    });
  }

  changeRepeatPrivateCode(e) {
    this.setState({
      repeatPrivateCode: e.target.value,
    });
  }

  changePin(e) {
    const value = e.target.value;
    this.setState({
      pin: value !== '' ? Number(value) : '',
    });
  }

  validate() {
    const { pin, privateCode, repeatPrivateCode } = this.state;
    if (privateCode === '') {
      return '';
    }
    if (privateCode.length < 8) {
      return 'Den personlige koden er for kort (minimum 8 tegn)';
    }
    if (privateCode !== repeatPrivateCode) {
      return 'Personlige koder stemmer ikke overens';
    }
    if (pin === '') {
      return 'Pinkode kan ikke være tom';
    }
    return null;
  }

  submit(e) {
    e.preventDefault();
    if (this.props.registered || this.validate() === null) {
      const { pin, privateCode } = this.state;
      const { username } = this.props;
      const passwordHash = SHA256(privateCode + username).toString();
      this.props.register(pin, passwordHash);
      localStorage.setItem('passwordHash', passwordHash);
    }
  }

  render() {
    const { privateCode, repeatPrivateCode, pin } = this.state;
    const { registered, registrationOpen, authenticated } = this.props;
    const errorMessage = !registered && this.validate();
    let buttonText = 'Registreringen er ikke åpen';
    if (registrationOpen) {
      buttonText = 'Fullfør registering';
    } else if (registered) {
      buttonText = 'Logg inn';
    }
    // Redirect to home if already registered
    if (authenticated) {
      return <Redirect to="/" />;
    }
    return (
      <DocumentTitle title="Registrering for generalforsamling">
        <Card classes={css.setup} title="Registrering for generalforsamling">
          <form onSubmit={e => this.submit(e)}>
            {!registered && <label>
              <div className={css.text}>Pin kode</div>
              <input
                type="number"
                value={pin}
                onChange={e => this.changePin(e)}
              />
              <div className={css.help}>Kode oppgitt under generalforsamling</div>
            </label>}
            <label>
              <div className={css.text}>Personlig kode</div>
              <input
                type="password"
                value={privateCode}
                onChange={e => this.changePrivateCode(e)}
              />
              <div className={css.help}>
                Personlig kode brukes for å lage en unik hash som brukes til hemmelige valg.
                Denne lagres ikke og det er derfor ytterst viktig at du ikke glemmer den.
              </div>
            </label>
            {!registered && <label>
              <div className={css.text}>Gjenta personlig kode</div>
              <input
                type="password"
                value={repeatPrivateCode}
                onChange={e => this.changeRepeatPrivateCode(e)}
              />
            </label>}
            { errorMessage &&
              <p className={css.warning}>
                {errorMessage}
              </p>
            }
            <div>
              <Button
                background
                size="lg"
                disabled={!registered && (errorMessage !== null || !this.props.registrationOpen)}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </Card>
      </DocumentTitle>
    );
  }
}

Setup.defaultProps = {
  registered: false,
  registrationOpen: false,
  authenticated: false,
};

Setup.propTypes = {
  register: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  registered: PropTypes.bool,
  registrationOpen: PropTypes.bool,
  authenticated: PropTypes.bool,
};

export default Setup;

const mapStateToProps = ({ auth, meeting }) => ({
  username: auth.username,
  registered: auth.registered,
  registrationOpen: meeting.registrationOpen,
  authenticated: auth.authenticated,
});
const mapDispatchToProps = dispatch => ({
  register: (...a) => {
    dispatch(register(...a));
  },
});
export const SetupContainer = connect(mapStateToProps, mapDispatchToProps)(Setup);
