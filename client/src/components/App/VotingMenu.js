import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { submitAnonymousVote, submitRegularVote } from '../../actionCreators/voting';
import { getShuffledAlternatives } from '../../selectors/alternatives';
import { activeIssueExists, getIssue, getIssueId, getOwnVote } from '../../selectors/issues';
import Alternatives from '../Alternatives';
import Button from '../Button';

class VotingMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedVote: null,
      displayVote: false,
    };
  }

  handleChange(event) {
    this.setState({
      selectedVote: event.currentTarget.value,
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
    const { alternatives, issueIsActive, isLoggedIn, ownVote } = this.props;
    const { displayVote, selectedVote } = this.state;
    const hasSelectedVote = !!selectedVote;
    const hasVoted = !!ownVote;
    const canVote = !isLoggedIn || !hasSelectedVote || hasVoted;
    const selected = hasVoted ? (displayVote && ownVote) : selectedVote;

    return (
      <div>
        <Alternatives
          alternatives={alternatives}
          disabled={hasVoted}
          handleChange={(...a) => this.handleChange(...a)}
          selectedVote={selected}
        />
        <Button
          background
          size="lg"
          onClick={() => this.handleClick()}
          disabled={canVote}
          hidden={!issueIsActive}
        >
          {hasVoted ? 'Du har allerede stemt' : 'Avgi stemme'}
        </Button>
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
    );
  }
}

VotingMenu.defaultProps = {
  voterKey: undefined,
  alternatives: [],
  issueId: '',
  isLoggedIn: undefined,
  ownVote: null,
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  issueId: React.PropTypes.string,
  issueIsActive: React.PropTypes.bool.isRequired,
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
