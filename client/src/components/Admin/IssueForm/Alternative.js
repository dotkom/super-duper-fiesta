import React, { PropTypes } from 'react';
import Dialog from '../../Dialog';
import Button from '../../Button';
import css from './Alternative.css';

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
      <div className={css.alternative}>
        <h2 className={css.title}>Alternativer</h2>
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
        <div className={css.content}>
          <ul>
            {Object.keys(alternatives).map(id =>
              <li key={id}>
                <p>{alternatives[id].text}</p>
                <Button onClick={() => this.openUpdateDialog(id)}>
                  <div className="flaticon-edit" />
                </Button>
                <Button onClick={() => handleRemoveAlternative(id)}>
                  <div className="flaticon-cross" />
                </Button>
              </li>,
            )}
          </ul>
          <div className={css.add}>
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
  alternatives: PropTypes.objectOf(React.PropTypes.string).isRequired,
};

export default Alternative;
