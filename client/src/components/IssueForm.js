import React from 'react';
import Button from './Button';
import '../css/IssueForm.css';
import IssueFormAlternative from './IssueFormAlternative';
import IssueFormCheckboxes from './IssueFormCheckboxes';
import SelectResolutionType from './SelectResolutionType';

const YES_NO_ANSWERS = [
  { text: 'Ja' },
  { text: 'Nei' },
];

let alternativeId = 0;

class IssueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issueDescription: '',
      alternatives: YES_NO_ANSWERS,
      secretVoting: false,
      showOnlyWinner: false,
      countBlankVotes: false,
      voteDemand: 1 / 2,
    };

    this.handleAddAlternative = this.handleAddAlternative.bind(this);
    this.handleUpdateAlternativeText = this.handleUpdateAlternativeText.bind(this);
    this.handleRemoveAlternative = this.handleRemoveAlternative.bind(this);
    this.handleCreateIssue = this.handleCreateIssue.bind(this);
    this.updateIssueDescription = this.updateIssueDescription.bind(this);
    this.handleUpdateCountBlankVotes = this.handleUpdateCountBlankVotes.bind(this);
    this.handleUpdateSecretVoting = this.handleUpdateSecretVoting.bind(this);
    this.handleUpdateShowOnlyWinner = this.handleUpdateShowOnlyWinner.bind(this);
    this.handleResolutionTypeChange = this.handleResolutionTypeChange.bind(this);
  }

  handleAddAlternative(alternativeText) {
    this.handleUpdateAlternativeText(
      alternativeId++,
      alternativeText,
    );
  }

  handleUpdateAlternativeText(id, text) {
    this.setState({
      alternatives: {
        ...this.state.alternatives,
        [id]: text,
      },
    });
  }

  handleRemoveAlternative(id) {
    const { alternatives } = this.state;
    delete alternatives[id];
    this.setState({ alternatives });
  }

  handleCreateIssue() {
    const { createIssue } = this.props;
    const { issueDescription, alternatives, countBlankVotes, secretVoting, showOnlyWinner, voteDemand } = this.state;
    createIssue(issueDescription, alternatives, voteDemand, showOnlyWinner, secretVoting, countBlankVotes,
    );
  }

  updateIssueDescription(e) {
    this.setState({ issueDescription: e.target.value });
  }

  handleUpdateCountBlankVotes(countBlankVotes) {
    this.setState({ countBlankVotes });
  }

  handleUpdateSecretVoting(secretVoting) {
    this.setState({ secretVoting });
  }

  handleUpdateShowOnlyWinner(showOnlyWinner) {
    this.setState({ showOnlyWinner });
  }

  handleResolutionTypeChange(voteDemand) {
    this.setState({ voteDemand });
  }

  render() {
    const showActiveIssueWarning = this.props.issue && this.props.issue.text;
    const issueReadyToCreate = !showActiveIssueWarning && this.state.issueDescription && this.state.issueDescription.length;
    return (
      <div className="IssueForm">
        <p
          className="IssueForm--ActiveIssueWarning"
          hidden={!showActiveIssueWarning}
        >Det er allerede en aktiv sak!</p>
        <label className="IssueForm-textarea">
          <div className="IssueForm-label">Beskrivelse</div>
          <textarea
            onChange={this.updateIssueDescription}
            placeholder="Skriv inn saken her."
            value={this.state.issueDescription}
          />
          <p>Beskrivelse av saken</p>
        </label>
        <IssueFormAlternative
          alternatives={this.state.alternatives}
          handleAddAlternative={this.handleAddAlternative}
          handleUpdateAlternativeText={this.handleUpdateAlternativeText}
          handleRemoveAlternative={this.handleRemoveAlternative}
        />
        <div className="IssueForm-label">Innstillinger</div>
        <IssueFormCheckboxes
          handleUpdateCountBlankVotes={this.handleUpdateCountBlankVotes}
          handleUpdateSecretVoting={this.handleUpdateSecretVoting}
          handleUpdateShowOnlyWinner={this.handleUpdateShowOnlyWinner}
          countBlankVotes={this.state.countBlankVotes}
          secretVoting={this.state.secretVoting}
          showOnlyWinner={this.state.showOnlyWinner}
        />
        <label className="IssueForm-select">
          <div className="IssueForm-label">Flertallstype</div>
          <SelectResolutionType
            handleResolutionTypeChange={this.handleResolutionTypeChange}
            resolutionType={this.state.voteDemand}
          />
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
