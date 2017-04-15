import React from 'react';
import { connect } from 'react-redux';
import Button from '../../Button';
import { createIssue } from '../../../actionCreators/adminButtons';
import { activeIssueExists } from '../../../selectors/issues';
import Alternative from './Alternative';
import Checkboxes from './Checkboxes';
import SelectResolutionType from './SelectResolutionType';
import SelectQuestionType from './SelectQuestionType';
import css from './index.css';

const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';

const YES_NO_ANSWERS = [
  {
    id: 0,
    text: 'Ja',
  },
  {
    id: 1,
    text: 'Nei',
  },
];

let alternativeId = 0;

class IssueForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issueDescription: '',
      alternatives: [],
      secretVoting: false,
      showOnlyWinner: false,
      countBlankVotes: false,
      voteDemand: 1 / 2,
      questionType: MULTIPLE_CHOICE,
    };
  }

  handleAddAlternative(text) {
    this.handleUpdateAlternativeText(alternativeId, text);
    alternativeId += 1;
  }

  handleUpdateAlternativeText(id, text) {
    const { alternatives } = this.state;
    this.setState({
      alternatives: Object.assign({}, alternatives, {
        [id]: {
          text,
          id,
        },
      }),
    });
  }

  handleRemoveAlternative(id) {
    const { alternatives } = this.state;
    this.setState({
      alternatives: Object.keys(alternatives).reduce((result, key) => {
        const newResult = result;
        if (key !== String(id)) {
          newResult[key] = alternatives[key];
        }
        return newResult;
      }, {}),
    });
  }

  handleCreateIssue() {
    const { alternatives, questionType } = this.state;

    let issueAlternatives;
    if (questionType === MULTIPLE_CHOICE) {
      issueAlternatives = Object.keys(alternatives).map(id => ({
        text: alternatives[id].text,
      }));
    } else {
      issueAlternatives = YES_NO_ANSWERS;
    }

    this.props.createIssue(
      this.state.issueDescription,
      issueAlternatives,
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
      <div className={css.form}>
        <p
          className={css.warning}
          hidden={!showActiveIssueWarning}
        >Det er allerede en aktiv sak!</p>
        <label className={css.textarea}>
          <h2 className={css.title}>Beskrivelse av saken</h2>
          <textarea
            onChange={(...a) => this.updateIssueDescription(...a)}
            placeholder="Skriv inn saken her."
            value={this.state.issueDescription}
          />
        </label>
        <label>
          <h2 className={css.title}>Spørsmålstype</h2>
          <SelectQuestionType
            questionType={this.state.questionType}
            handleQuestionTypeChange={(...a) => this.handleQuestionTypeChange(...a)}
          />
        </label>
        {this.state.questionType === MULTIPLE_CHOICE
        && <Alternative
          alternatives={this.state.alternatives}
          handleAddAlternative={(...a) => this.handleAddAlternative(...a)}
          handleUpdateAlternativeText={(...a) => this.handleUpdateAlternativeText(...a)}
          handleRemoveAlternative={(...a) => this.handleRemoveAlternative(...a)}
        />
        }
        <Checkboxes
          handleUpdateCountBlankVotes={(...a) => this.handleUpdateCountBlankVotes(...a)}
          handleUpdateSecretVoting={(...a) => this.handleUpdateSecretVoting(...a)}
          handleUpdateShowOnlyWinner={(...a) => this.handleUpdateShowOnlyWinner(...a)}
          countBlankVotes={this.state.countBlankVotes}
          secretVoting={this.state.secretVoting}
          showOnlyWinner={this.state.showOnlyWinner}
        />
        <label>
          <h2 className={css.title}>Flertallstype</h2>
          <SelectResolutionType
            handleResolutionTypeChange={(...a) => this.handleResolutionTypeChange(...a)}
            resolutionType={this.state.voteDemand}
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
