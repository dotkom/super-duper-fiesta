import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { submitAnonymousVote, submitRegularVote } from '../../actionCreators/voting';
import { getShuffledAlternatives } from '../../selectors/alternatives';
import { getIssue, getIssueId } from '../../selectors/issues';
import { getOwnVote } from '../../selectors/voting';
import Alternatives from '../Alternatives';
import Button from '../Button';

class VotingMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedVote: this.props.votedState.alternative,
    };
  }

  handleChange(event) {
    this.setState({
      selectedVote: event.currentTarget.value,
    });
  }

  handleClick() {
    // Voting is only allowed when you have a key.
    if (this.props.loggedIn) {
      this.props.handleVote(
        this.props.issueId,
        this.state.selectedVote,
        this.props.voterKey,
      );
    }
  }

  render() {
    const isLoggedIn = this.props.loggedIn;
    const hasSelectedVote = this.state.selectedVote !== undefined;
    const hasVoted = this.props.votedState.alternative;
    const buttonDisabled = !isLoggedIn || !hasSelectedVote || hasVoted;

    return (
      <div>
        <Alternatives
          alternatives={this.props.alternatives}
          handleChange={(...a) => this.handleChange(...a)}
          selectedVote={this.state.selectedVote}
        />
        <Button
          background
          size="lg"
          onClick={() => this.handleClick()}
          disabled={buttonDisabled}
        >
          {hasVoted ? 'Du har allerede stemt' : 'Avgi stemme'}
        </Button>
        {hasVoted ?
          <Button
            background
            size="lg"
            onClick={() => this.setState({
              selectedVote: this.state.selectedVote === this.props.votedState.alternative ?
                undefined : this.props.votedState.alternative,
            })}
          >
            {this.state.selectedVote === this.props.votedState.alternative ?
              'Skjul min stemme' : 'Vis min stemme'}
          </Button> : ''
        }
      </div>
    );
  }
}

VotingMenu.defaultProps = {
  voterKey: undefined,
  alternatives: [],
  issueId: '',
  votedState: {
    alternative: undefined,
    voter: undefined,
  },
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  issueId: React.PropTypes.string,
  loggedIn: React.PropTypes.bool.isRequired,

  votedState: React.PropTypes.shape({
    alternative: React.PropTypes.string,
    voter: React.PropTypes.string,
  }),
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

  votedState: getOwnVote(state, state.auth.id),
  voterKey: state.voterKey,
  loggedIn: state.auth.loggedIn,
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
