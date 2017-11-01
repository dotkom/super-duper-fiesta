import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { submitAnonymousVote, submitRegularVote } from '../../actionCreators/voting';
import { getShuffledAlternatives } from '../../selectors/alternatives';
import { activeIssueExists, getIssue, getIssueId, getOwnVote, getIssueKey } from '../../selectors/issues';
import Alternatives from '../Alternatives';
import Button from '../Button';
import { VOTING_NOT_STARTED, VOTING_IN_PROGRESS } from '../../../../common/actionTypes/issues';
import css from './VotingMenu.css';

class VotingMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedVote: null,
      displayVote: false,
    };
  }

  handleChange(event) {
    const newVote = this.state.selectedVote === event.currentTarget.value
      ? null : event.currentTarget.value;
    this.setState({
      selectedVote: newVote,
    });
  }

  handleClick() {
    this.props.handleVote(
      this.props.issueId,
      this.state.selectedVote,
      this.props.voterKey,
    );
    this.setState({
      displayVote: false,
      selectedVote: null,
    });
  }

  toggleVoteDisplay() {
    this.setState({
      displayVote: !this.state.displayVote,
    });
  }

  render() {
    const { alternatives, issueIsActive, issueStatus, isLoggedIn, ownVote } = this.props;
    const { displayVote, selectedVote } = this.state;
    const votingInProgress = issueStatus === VOTING_IN_PROGRESS;
    const hasSelectedVote = !!selectedVote;
    const hasVoted = !!ownVote;
    const canVote = !isLoggedIn || !hasSelectedVote || hasVoted;
    const selected = hasVoted ? (displayVote && ownVote) : selectedVote;

    return (
      <div>
        <Alternatives
          alternatives={alternatives}
          disabled={hasVoted || !votingInProgress}
          handleChange={(...a) => this.handleChange(...a)}
          selectedVote={selected}
        />
        <div className={css.buttons}>
          {issueIsActive && votingInProgress && <Button
            background
            size="lg"
            onClick={() => this.handleClick()}
            disabled={canVote || !votingInProgress}
          >
            {hasVoted ? 'Du har stemt' : 'Avgi stemme'}
          </Button>}
          {hasVoted && (
            <Button
              background
              size="lg"
              onClick={() => this.toggleVoteDisplay()}
            >
              {displayVote ?
                'Skjul min stemme' : 'Vis min stemme'}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

VotingMenu.defaultProps = {
  voterKey: undefined,
  alternatives: [],
  issueId: '',
  issueStatus: VOTING_NOT_STARTED,
  isLoggedIn: undefined,
  ownVote: null,
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  issueId: React.PropTypes.string,
  issueIsActive: React.PropTypes.bool.isRequired,
  issueStatus: React.PropTypes.string,
  isLoggedIn: React.PropTypes.bool,
  ownVote: React.PropTypes.string,
  voterKey: React.PropTypes.number,
};

const mapStateToProps = state => ({
  // Alternatives are shuffled as an attempt to prevent peeking over shoulders
  // to figure out what another person has voted for. This scramble needs
  // to be syncronized between LiveVoteCount and VoteHandler, so we take
  // advantage of the memoizing provided by reselect. This keeps the
  // scrambles in sync and avoids rescrambling unless the
  // available alternatives are changed.
  alternatives: getShuffledAlternatives(state),

  // The ID, or undefined, if there is no current issue.
  issueId: getIssueId(state),
  issue: getIssue(state),

  ownVote: getOwnVote(state, state.auth.id),

  voterKey: state.voterKey,
  isLoggedIn: state.auth.loggedIn,

  issueIsActive: activeIssueExists(state),
  issueStatus: getIssueKey(state, 'status'),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...ownProps,
    ...stateProps,
    handleVote: (issue, alternative) => {
      dispatch(stateProps.issue.secret ?
        submitAnonymousVote(issue, alternative, Cookies.get('passwordHash')) : submitRegularVote(issue, alternative));
    },
  };
};


export default VotingMenu;
export const VotingMenuContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(VotingMenu);
