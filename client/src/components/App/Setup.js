import React, { Component } from 'react';
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
      pin: e.target.value,
    });
  }

  matchingPrivateCodes() {
    const { privateCode, repeatPrivateCode } = this.state;
    if (privateCode === '') {
      return '';
    }
    if (privateCode.length <= 8) {
      return 'Den personlige koden er for kort (minimum 8 tegn)';
    }
    if (privateCode !== repeatPrivateCode) {
      return 'Personlige koder stemmer ikke overens';
    }
    return null;
  }

  render() {
    const { privateCode, repeatPrivateCode, pin } = this.state;
    const matchingPrivateCodesMessage = this.matchingPrivateCodes();
    return (
      <form className="Setup">
        <h2 className="Setup-title">Generalforsamling registrering</h2>
        <label>
          <div className="Setup-label-text">Pin kode</div>
          <input
            type="text"
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
        { matchingPrivateCodesMessage &&
          <p className="Setup-warning">
            {matchingPrivateCodesMessage}
          </p>
        }
        <Button background disabled={matchingPrivateCodesMessage !== null}>
          Fullfør registrering
        </Button>
      </form>
    );
  }
}

export default Setup;
