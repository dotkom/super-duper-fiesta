import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actionCreators/auth';
import Button from '../Button';
import '../../css/Setup.css';

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
    this.setState({
      pin: Number(e.target.value),
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
    if (this.validate() === null) {
      const { pin, privateCode } = this.state;
      this.props.register(pin, privateCode);
    }
  }

  render() {
    const { privateCode, repeatPrivateCode, pin } = this.state;
    const errorMessage = this.validate();
    return (
      <form className="Setup" onSubmit={(e) => this.submit(e)}>
        <h2 className="Setup-title">Generalforsamling registrering</h2>
        <label>
          <div className="Setup-label-text">Pin kode</div>
          <input
            type="number"
            value={pin}
            onChange={e => this.changePin(e)}
          />
          <div className="Setup-label-help">Kode oppgitt under generalforsamling</div>
        </label>
        <label>
          <div className="Setup-label-text">Personlig kode</div>
          <input
            type="password"
            value={privateCode}
            onChange={e => this.changePrivateCode(e)}
          />
          <div className="Setup-label-help">
            Personlig kode brukes for å lage en unik hash som brukes til hemmelige valg.
            Denne lagres ikke og det er derfor ytterst viktig at du ikke glemmer den.
          </div>
        </label>
        <label>
          <div className="Setup-label-text">Gjenta personlig kode</div>
          <input
            type="password"
            value={repeatPrivateCode}
            onChange={e => this.changeRepeatPrivateCode(e)}
          />
        </label>
        { errorMessage &&
          <p className="Setup-warning">
            {errorMessage}
          </p>
        }
        <Button background disabled={errorMessage !== null}>
          Fullfør registrering
        </Button>
      </form>
    );
  }
}

Setup.propTypes = {
  register: PropTypes.func.isRequired,
};

export default Setup;
const mapDispatchToProps = dispatch => ({
  register: (...a) => {
    dispatch(register(...a));
  },
});
export const SetupContainer = connect(null, mapDispatchToProps)(Setup);
