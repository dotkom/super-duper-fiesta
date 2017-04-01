import React from 'react';
import { connect } from 'react-redux';
import Button from '../../Button';
import { createIssue } from '../../../actionCreators/adminButtons';
import { getIssue } from '../../../selectors/issues';
import Alternative from './Alternative';
import Checkboxes from './Checkboxes';
import SelectResolutionType from './SelectResolutionType';
import '../../../css/IssueForm.css';

const YES_NO_ANSWERS = {
  0: 'Ja',
  1: 'Nei',
};

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
    alternativeId += 1;
    this.handleUpdateAlternativeText(
      alternativeId,
      alternativeText,
    );
  }

  handleUpdateAlternativeText(id, text) {
    this.setState({
      alternatives: Object.assign({}, this.state.alternatives, {
        [id]: text,
      }),
    });
  }

  handleRemoveAlternative(id) {
    const { alternatives } = this.state;
    delete alternatives[id];
    this.setState({ alternatives });
  }

  handleCreateIssue() {
    this.props.createIssue(
      this.state.issueDescription,
      this.state.alternatives,
      this.state.voteDemand,
      this.state.showOnlyWinner,
      this.state.secretVoting,
      this.state.countBlankVotes,
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

    const issueReadyToCreate = !showActiveIssueWarning
      && this.state.issueDescription
      && this.state.issueDescription.length;

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
        <Alternative
          alternatives={this.state.alternatives}
          handleAddAlternative={this.handleAddAlternative}
          handleUpdateAlternativeText={this.handleUpdateAlternativeText}
          handleRemoveAlternative={this.handleRemoveAlternative}
        />
        <div className="IssueForm-label">Innstillinger</div>
        <Checkboxes
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
  issue: React.PropTypes.shape({
    text: React.PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  issue: getIssue(state),
  issueDescription: state.issueDescription ? state.issueDescription : '',
});

const mapDispatchToProps = dispatch => ({
  createIssue: (description, alternatives, voteDemand, showOnlyWinner, secretElection, countBlankVotes) => {
    dispatch(createIssue(description, alternatives, voteDemand, showOnlyWinner, secretElection, countBlankVotes));
  },
});

export default IssueForm;
export const IssueFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssueForm);
