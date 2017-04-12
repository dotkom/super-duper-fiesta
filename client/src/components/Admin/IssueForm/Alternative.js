import React, { PropTypes } from 'react';
import Dialog from '../../Dialog';
import Button from '../../Button';
import IconText from '../../IconText';

class Alternative extends React.Component {
  constructor() {
    super();

    this.state = {
      showUpdateDialog: false,
      dialogValue: '',
      selectedAlternative: undefined,
      alternativeText: '',
    };
  }

  handleAddAlternative() {
    this.props.handleAddAlternative(this.state.alternativeText);
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
      dialogValue: this.props.alternatives[id],
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
        <h4 className="IssueForm-label">Alternativer</h4>
        <Dialog
          visible={this.state.showUpdateDialog}
          onClose={(...a) => this.closeUpdateDialog(...a)}
          title="Endre alternativ"
        >
          <input
            type="text" value={this.state.dialogValue}
            onChange={(...a) => this.updateDialogValue(...a)}
          />
          <Button background onClick={(...a) => this.confirmUpdateDialog(...a)}>Bekreft</Button>
          <Button background onClick={(...a) => this.closeUpdateDialog(...a)}>Avbryt</Button>
        </Dialog>
        <div className="IssueFormAlternative-content">
          <ul>
            {Object.keys(alternatives).map(id =>
              <li key={id}>
                <p>{alternatives[id]}</p>
                <Button onClick={() => this.openUpdateDialog(id)}>
                  <div className="flaticon-edit" />
                </Button>
                <Button onClick={() => handleRemoveAlternative(id)}>
                  <div className="flaticon-cross" />
                </Button>
              </li>,
            )}
          </ul>
          <div className="IssueFormAlternative-add">
            <input
              type="text"
              value={alternativeText}
              onChange={e => this.handleAlternativeUpdate(e)}
              onKeyPress={e => this.handleKeyPress(e)}
            />
            <Button onClick={(...a) => this.handleAddAlternative(...a)}>
              <div className="flaticon-plus" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Alternative.defaultProps = {
  alternativeText: undefined,
};

Alternative.propTypes = {
  alternativeText: PropTypes.string,
  handleUpdateAlternativeText: PropTypes.func.isRequired,
  handleAddAlternative: PropTypes.func.isRequired,
  handleRemoveAlternative: PropTypes.func.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default Alternative;
