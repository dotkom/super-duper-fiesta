import React from 'react';
import { connect } from 'react-redux';
import Button from '../../Button';
import { createIssue } from '../../../actionCreators/adminButtons';
import { activeIssueExists } from '../../../selectors/issues';
import Alternative from './Alternative';
import Checkboxes from './Checkboxes';
import SelectResolutionType from './SelectResolutionType';
import SelectQuestionType from './SelectQuestionType';
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
      questionType: 'MULTIPLE_CHOICE',
    };
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

  handleQuestionTypeChange(questionType) {
    this.setState({ questionType });
  }

  render() {
    const showActiveIssueWarning = this.props.activeIssue;

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
            onChange={(...a) => this.updateIssueDescription(...a)}
            placeholder="Skriv inn saken her."
            value={this.state.issueDescription}
          />
          <p>Beskrivelse av saken</p>
        </label>
        {this.state.questionType === 'MULTIPLE_CHOICE'
        && <Alternative
          alternatives={this.state.alternatives}
          handleAddAlternative={(...a) => this.handleAddAlternative(...a)}
          handleUpdateAlternativeText={(...a) => this.handleUpdateAlternativeText(...a)}
          handleRemoveAlternative={(...a) => this.handleRemoveAlternative(...a)}
        />
        }
        <div className="IssueForm-label">Innstillinger</div>
        <Checkboxes
          handleUpdateCountBlankVotes={(...a) => this.handleUpdateCountBlankVotes(...a)}
          handleUpdateSecretVoting={(...a) => this.handleUpdateSecretVoting(...a)}
          handleUpdateShowOnlyWinner={(...a) => this.handleUpdateShowOnlyWinner(...a)}
          countBlankVotes={this.state.countBlankVotes}
          secretVoting={this.state.secretVoting}
          showOnlyWinner={this.state.showOnlyWinner}
        />
        <label className="IssueForm-select">
          <div className="IssueForm-label">Flertallstype</div>
          <SelectResolutionType
            handleResolutionTypeChange={(...a) => this.handleResolutionTypeChange(...a)}
            resolutionType={this.state.voteDemand}
          />
        </label>
        <label className="IssueForm-select">
          <div className="IssueForm-label">Spørsmålstype</div>
          <SelectQuestionType
            questionType={this.state.questionType}
            handleQuestionTypeChange={(...a) => this.handleQuestionTypeChange(...a)}
          />
        </label>
        <Button
          background
          onClick={() => this.handleCreateIssue()}
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
  activeIssue: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  activeIssue: activeIssueExists(state),
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
