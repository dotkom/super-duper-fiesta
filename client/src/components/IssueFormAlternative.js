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
      alternativeText: '',
    };

    this.handleAddAlternative = this.handleAddAlternative.bind(this);
    this.handleAlternativeUpdate = this.handleAlternativeUpdate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openUpdateDialog = this.openUpdateDialog.bind(this);
    this.closeUpdateDialog = this.closeUpdateDialog.bind(this);
    this.updateDialogValue = this.updateDialogValue.bind(this);
    this.confirmUpdateDialog = this.confirmUpdateDialog.bind(this);
  }

  handleAddAlternative() {
    this.props.handleAddAlternative(this.props.alternativeText);
  }

  handleAlternativeUpdate(event) {
    this.setState({
      alternativeText: event.target.value,
    });
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
    this.props.handleUpdateAlternativeText(this.state.selectedAlternative, this.state.dialogValue);
  }

  render() {
    const {
      alternativeText,
      alternatives,
      handleRemoveAlternative,
    } = this.props;

    return (
      <div className="IssueFormAlternative">
        <ul>
          {Object.keys(alternatives).map(id =>
            <li key={alternatives[id].text}>
              {alternatives[id].text}
              <button
                onClick={() => handleRemoveAlternative(id)}
              >Fjern</button>
              <button onClick={() => this.openUpdateDialog(id)}>Endre</button>
            </li>,
          )}
        </ul>

        <label className="IssueForm-radios">
          <Dialog
            visible={this.state.showUpdateDialog}
            onClose={this.closeUpdateDialog}
            title="Endre alternativ"
          >
            <input type="text" onChange={this.updateDialogValue} value={this.state.dialogValue} />
            <Button onClick={this.confirmUpdateDialog}>Bekreft</Button>
            <Button onClick={this.closeUpdateDialog}>Avbryt</Button>
          </Dialog>

          <input
            type="text"
            value={alternativeText}
            onChange={e => this.handleAlternativeUpdate(e.target.value)}
            onKeyPress={this.handleKeyPress}
          />

          <button onClick={this.handleAddAlternative}>Add</button>
        </label>
      </div>
    );
  }
}

IssueFormAlternative.defaultProps = {
  alternativeText: undefined,
};

IssueFormAlternative.propTypes = {
  alternativeText: PropTypes.string,
  handleUpdateAlternativeText: PropTypes.func.isRequired,
  handleAddAlternative: PropTypes.func.isRequired,
  handleRemoveAlternative: PropTypes.func.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default IssueFormAlternative;
