import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { RESOLUTION_TYPES } from 'common/actionTypes/voting';
import { adminDeleteIssue, createIssue } from 'features/adminButtons/actionCreators';
import { activeIssueExists, getIssue } from 'features/issue/selectors';
import Button from '../../Button';
import Dialog from '../../Dialog';
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

function getIssueContents(issue) {
  return Object.assign(blankIssue, {
    issueDescription: issue.text || '',
    alternatives: issue.alternatives ? issue.alternatives.filter(alt => alt.text !== 'Blank') : {},
    secretVoting: issue.secret || false,
    showOnlyWinner: issue.showOnlyWinner || false,
    countBlankVotes: issue.countingBlankVotes || false,
    voteDemand: issue.voteDemand || RESOLUTION_TYPES.regular.key,
    questionType: MULTIPLE_CHOICE, // @ToDo: This is not stored in state.
  });
}

class IssueForm extends React.Component {
  constructor(props) {
    super(props);

    const issue = props.issue || {};

    const issueContents = getIssueContents(issue);

    this.state = Object.assign(issueContents, {
      redirectToAdminHome: false,
      showUpdateIssuePrompt: false,
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

    if (!this.state.editingIssue) {
      // Only add default options if not editing issue. Otherwise they'll already be added.
      DEFAULT_ALTERNATIVES.forEach(alternative => issueAlternatives.push(alternative));
    }

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

  handleUpdateIssue() {
    this.props.deleteIssue();
    this.handleCreateIssue();
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
        <div>
          <Dialog
            title="Bekreft oppdatering av sak"
            subtitle={'Ved oppdatering av en sak vil aktiv sak lukkes og det åpnes en ny ' +
            'med de nye innstillingene.'}
            visible={this.state.showUpdateIssuePrompt}
            onClose={() => this.setState({ showUpdateIssuePrompt: false })}
          >
            <Button
              background
              onClick={() => this.handleUpdateIssue()}
            >Bekreft</Button>
            <Button
              background
              onClick={() => this.setState({ showUpdateIssuePrompt: false })}
            >Avbryt</Button>
          </Dialog>
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
            <div className={css.inputGroups}>
              <div className={css.inputGroup}>
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
              </div>
              <div className={css.inputGroup}>
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
              </div>
            </div>
            {this.props.activeIssue ?
              <Button
                background
                onClick={() => this.setState({ showUpdateIssuePrompt: true })}
                size="lg"
              >Oppdater aktiv sak</Button> :
              <Button
                background
                onClick={() => this.handleCreateIssue()}
                disabled={!issueReadyToCreate}
                size="lg"
              >Opprett ny sak</Button>}
          </div>
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
  deleteIssue: React.PropTypes.func.isRequired,
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

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...ownProps,
    ...stateProps,
    deleteIssue: () => {
      dispatch(adminDeleteIssue({ issue: stateProps.issue.id }));
    },
    createIssue: (description, alternatives, voteDemand, showOnlyWinner,
      secretElection, countBlankVotes) => {
      dispatch(createIssue(description, alternatives, voteDemand, showOnlyWinner,
        secretElection, countBlankVotes));
    },
  };
};

export default IssueForm;

export const IssueFormContainer = connect(
    mapStateToProps,
    null,
    mergeProps,
)(IssueForm);
