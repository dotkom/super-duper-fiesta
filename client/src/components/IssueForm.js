import React from 'react';
import Button from './Button';
import '../css/IssueForm.css';
import SelectResolutionTypeContainer from '../containers/SelectResolutionTypeContainer';
import SelectQuestionTypeContainer from '../containers/SelectQuestionTypeContainer';
import AddIssueFormAlternative from '../containers/AddIssueFormAlternative';
import IssueFormSettings from '../containers/IssueFormSettings';

const YES_NO_ANSWERS = [
  { text: 'Ja' },
  { text: 'Nei' },
];

class IssueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issueDescription: '',
      alternatives: YES_NO_ANSWERS,
    };

    this.handleAddAlternative = this.handleAddAlternative.bind(this);
    this.handleCreateIssue = this.handleCreateIssue.bind(this);
    this.updateIssueDescription = this.updateIssueDescription.bind(this);
  }

  handleAddAlternative(alternativeText) {
    const { alternatives } = this.state;
    alternatives.push({ text: alternativeText });
    this.setState({ alternatives });
  }

  handleCreateIssue() {
    const { createIssue } = this.props;
    createIssue(this.state.issueDescription, this.state.alternatives,
      1, false, false, // @ToDo: Get from state.
    );
  }

  updateIssueDescription(e) {
    this.setState({ issueDescription: e.target.value });
  }

  render() {
    const issueReadyToCreate = this.state.issueDescription && this.state.issueDescription.length;
    return (
      <div className="IssueForm">
        <label className="IssueForm-textarea">
          <div className="IssueForm-label">Beskrivelse</div>
          <textarea
            onChange={this.updateIssueDescription}
            placeholder="Skriv inn saken her."
            value={this.state.issueDescription}
          />
          <p>Beskrivelse av saken</p>
        </label>
        <AddIssueFormAlternative
          alternatives={this.state.alternatives}
          handleAddAlternative={this.handleAddAlternative}
        />
        <div className="IssueForm-label">Innstillinger</div>
        <IssueFormSettings />
        <label className="IssueForm-select">
          <div className="IssueForm-label">Flertallstype</div>
          <SelectResolutionTypeContainer />
        </label>
        <label className="IssueForm-select">
          <div className="IssueForm-label">Spørsmålstype</div>
          <SelectQuestionTypeContainer />
        </label>
        <Button
          background
          onClick={this.handleCreateIssue}
          disabled={!issueReadyToCreate}
        >Lagre sak</Button>
      </div>
    );
  }
}

IssueForm.defaultProps = {
  createIssue: undefined,
};

IssueForm.propTypes = {
  createIssue: React.PropTypes.func,
};

export default IssueForm;
