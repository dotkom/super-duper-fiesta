import React, { PropTypes } from 'react';
import Dialog from './Dialog';
import Button from './Button';

class IssueFormAlternative extends React.Component {
  constructor() {
    super();

    this.state = {
      showUpdateDialog: false,
      dialogValue: '',
      selectedAlternative: undefined,
    };

  }

  handleAddAlternative() {
    this.props.handleAddAlternative(this.props.alternativeText);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleAddAlternative();
    }
  }

  openUpdateDialog(id) {
    this.setState({
      showUpdateDialog: true,
      dialogValue: this.props.alternatives[id].text,
      selectedAlternative: id,
    });
  }

  closeUpdateDialog() {
    this.setState({
      showUpdateDialog: false,
    });
  }

  updateDialogValue(event) {
    this.setState({
      dialogValue: event.target.value,
    });
  }

  confirmUpdateDialog() {
    this.closeUpdateDialog();
    this.props.updateAlternativeText(this.state.selectedAlternative, this.state.dialogValue);
  }

  render() {
    const {
      display,
      alternativeText,
      alternativeUpdate,
      alternatives,
      removeAlternative,
    } = this.props;

    return display && (
      <div className="IssueFormAlternative">
        <ul>
          {this.props.alternatives.map(alternative =>
            <li key={alternative.text}>
              {alternative.text}
              <button
                onClick={(...a) => removeAlternative(alternative.id)}
              >Fjern</button>
              <button onClick={(...a) => this.openUpdateDialog(alternative.id)}>Endre</button>
            </li>,
          )}
        </ul>

        <label className="IssueForm-radios">
          <Dialog
            visible={(...a) => this.state.showUpdateDialog(...a)}
            onClose={(...a) => this.closeUpdateDialog(...a)}
            title="Endre alternativ"
          >
            <input type="text" onChange={(...a) => this.updateDialogValue(...a)} value={this.state.dialogValue} />
            <Button onClick={(...a) => this.confirmUpdateDialog(...a)}>Bekreft</Button>
            <Button onClick={(...a) => this.closeUpdateDialog(...a)}>Avbryt</Button>
          </Dialog>

          <input
            type="text"
            value={alternativeText}
            onChange={e => alternativeUpdate(e.target.value)}
            onKeyPress={(...a) => this.handleKeyPress(...a)}
          />

          <button onClick={(...a) => this.handleAddAlternative(...a)}>Add</button>
        </label>
      </div>
    );
  }
}

IssueFormAlternative.propTypes = {
  alternativeText: PropTypes.string.isRequired,
  alternativeUpdate: PropTypes.func.isRequired,
  updateAlternativeText: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
  handleAddAlternative: PropTypes.func.isRequired,
  removeAlternative: PropTypes.func.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default IssueFormAlternative;
