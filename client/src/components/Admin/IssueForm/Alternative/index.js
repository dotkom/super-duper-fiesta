import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../../Dialog';
import Button from '../../../Button';
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
    if (this.state.alternativeText.length > 0) {
      this.props.handleAddAlternative(this.state.alternativeText);
      this.setState({ alternativeText: '' });
    }
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
      alternatives,
      handleRemoveAlternative,
    } = this.props;
    const { alternativeText } = this.state;

    return (
      <div className={css.alternative}>
        <h2 className={css.title}>Alternativer</h2>
        <Dialog
          visible={this.state.showUpdateDialog}
          onClose={(...a) => this.closeUpdateDialog(...a)}
          title="Endre alternativ"
        >
          <input
            className={css.dialogInput}
            type="text" value={this.state.dialogValue}
            onChange={(...a) => this.updateDialogValue(...a)}
          />
          <Button background onClick={(...a) => this.confirmUpdateDialog(...a)}>Bekreft</Button>
          <Button background onClick={(...a) => this.closeUpdateDialog(...a)}>Avbryt</Button>
        </Dialog>
        { Object.keys(alternatives).length > 0 && (
          <div className={css.content}>
            <ul>
              {Object.keys(alternatives).map(id =>
                <li key={id}>
                  <p>{alternatives[id].text}</p>
                  <Button onClick={() => this.openUpdateDialog(id)}>
                    <div className={css.edit} />
                  </Button>
                  <Button onClick={() => handleRemoveAlternative(id)}>
                    <div className={css.remove} />
                  </Button>
                </li>,
              )}
            </ul>
          </div>
        )}
        <div className={css.content}>
          <div className={css.add}>
            <input
              type="text"
              value={alternativeText}
              onChange={e => this.handleAlternativeUpdate(e)}
              placeholder="Nytt alternativ"
              onKeyPress={e => this.handleKeyPress(e)}
            />
            <Button onClick={(...a) => this.handleAddAlternative(...a)}>
              <div className={css.addIcon} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Alternative.propTypes = {
  handleUpdateAlternativeText: PropTypes.func.isRequired,
  handleAddAlternative: PropTypes.func.isRequired,
  handleRemoveAlternative: PropTypes.func.isRequired,
  alternatives: PropTypes.shape({
    text: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
};

export default Alternative;
