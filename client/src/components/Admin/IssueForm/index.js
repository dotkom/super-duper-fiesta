import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Button from '../../Button';
import { createIssue } from '../../../actionCreators/adminButtons';
import { RESOLUTION_TYPES } from '../../../../../common/actionTypes/voting';
import { activeIssueExists } from '../../../selectors/issues';
import Alternative from './Alternative';
import Checkboxes from './Checkboxes';
import SelectResolutionType from './SelectResolutionType';
import SelectQuestionType from './SelectQuestionType';
import css from './index.css';

const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';

const DEFAULT_ALTERNATIVES = [
  {
    text: 'Blank',
  },
];

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

const blankIssue = {
  issueDescription: '',
  alternatives: {},
  secretVoting: false,
  showOnlyWinner: false,
  countBlankVotes: false,
  voteDemand: RESOLUTION_TYPES.regular.key,
  questionType: MULTIPLE_CHOICE,
};

class IssueForm extends React.Component {
  constructor(props) {
    super(props);

    const issue = props.issue || {};

    this.state = Object.assign(blankIssue, {
      issueDescription: issue.text || '',
      alternatives: issue.alternatives || {},
      secretVoting: issue.secret || false,
      showOnlyWinner: issue.showOnlyWinner || false,
      countBlankVotes: issue.countingBlankVotes || false,
      voteDemand: issue.voteDemand || RESOLUTION_TYPES.regular.key,
      questionType: MULTIPLE_CHOICE, // @ToDo: This is not stored in state.
      redirectToAdminHome: false,
    });
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
      issueAlternatives = YES_NO_ANSWERS.slice();
    }

    DEFAULT_ALTERNATIVES.forEach(alternative => issueAlternatives.push(alternative));

    this.props.createIssue(
      this.state.issueDescription,
      issueAlternatives,
      this.state.voteDemand,
      this.state.showOnlyWinner,
      this.state.secretVoting,
      this.state.countBlankVotes,
    );

    // Redirect to admin home after creating issue.
    this.setState({ redirectToAdminHome: true });
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
    const { redirectToAdminHome } = this.state;

    const issueReadyToCreate = !showActiveIssueWarning
      && this.state.issueDescription
      && this.state.issueDescription.length;
    return (
      <DocumentTitle title="Ny sak">
        <div className={css.form}>
          {showActiveIssueWarning && <p
            className={css.warning}
          >Det er allerede en aktiv sak!</p>}
          {redirectToAdminHome &&
            <Redirect to="/admin" />}
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
            size="lg"
            disabled={!issueReadyToCreate}
          >Lagre sak</Button>
        </div>
      </DocumentTitle>
    );
  }
}

IssueForm.defaultProps = {
  createIssue: undefined,
  issue: {},
};

IssueForm.propTypes = {
  createIssue: React.PropTypes.func,
  issue: React.PropTypes.objectOf(React.PropTypes.shape({
    active: React.PropTypes.bool.isRequired,
    alternatives: React.PropTypes.arrayOf(
      React.PropTypes.objectOf({
        text: React.PropTypes.string.isRequired,
      })),
    secret: React.PropTypes.bool.isRequired,
    showOnlyWinner: React.PropTypes.bool.isRequired,
    voteDemand: React.PropTypes.string.isRequired,
  })),
  activeIssue: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  activeIssue: activeIssueExists(state),
  issue: getIssue(state),
  issueDescription: state.issueDescription ? state.issueDescription : '',
});

const mapDispatchToProps = dispatch => ({
  createIssue: (description, alternatives, voteDemand, showOnlyWinner,
    secretElection, countBlankVotes) => {
    dispatch(createIssue(description, alternatives, voteDemand, showOnlyWinner,
      secretElection, countBlankVotes));
  },
});

export default IssueForm;

export const IssueFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssueForm);
