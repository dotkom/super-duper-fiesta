import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setAlternativeText, addAlternative, clearAlternativeText, removeAlternative, updateAlternativeText } from '../../../actionCreators/createIssueForm';
import Dialog from '../../Dialog';
import Button from '../../Button';

class Alternative extends React.Component {
  constructor() {
    super();

    this.state = {
      showUpdateDialog: false,
      dialogValue: '',
      selectedAlternative: undefined,
    };

    this.handleAddAlternative = this.handleAddAlternative.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openUpdateDialog = this.openUpdateDialog.bind(this);
    this.closeUpdateDialog = this.closeUpdateDialog.bind(this);
    this.updateDialogValue = this.updateDialogValue.bind(this);
    this.confirmUpdateDialog = this.confirmUpdateDialog.bind(this);
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
                onClick={() => removeAlternative(alternative.id)}
              >Fjern</button>
              <button onClick={() => this.openUpdateDialog(alternative.id)}>Endre</button>
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
            onChange={e => alternativeUpdate(e.target.value)}
            onKeyPress={this.handleKeyPress}
          />

          <button onClick={this.handleAddAlternative}>Add</button>
        </label>
      </div>
    );
  }
}

Alternative.propTypes = {
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

const mapStateToProps = state => ({
  alternativeText: state.issueFormAlternativeText,
  // Display the component if the question type is set to multiple choice.
  display: state.questionType === 1,
});

const mapDispatchToProps = dispatch => ({
  alternativeUpdate: (text) => {
    dispatch(setAlternativeText(text));
  },

  addAlternative: (text) => {
    dispatch(addAlternative(text));
    dispatch(clearAlternativeText());
  },

  updateAlternativeText: (id, text) => {
    dispatch(updateAlternativeText(id, text));
  },

  removeAlternative: (id) => {
    dispatch(removeAlternative(id));
  },
});

export default Alternative;
export const AlternativeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Alternative);