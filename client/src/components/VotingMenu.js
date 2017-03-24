import React from 'react';
import Alternatives from './Alternatives';
import Button from './Button';
import '../css/VotingMenu.css';

class VotingMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedVote: undefined,
    };
  }

  handleChange(event) {
    this.setState({
      selectedVote: event.currentTarget.value,
    });
  }

  handleClick() {
    // Voting is only allowed when you have a key.
    if (this.props.voterKey) {
      this.props.handleVote(
        this.props.issueId,
        this.state.selectedVote,
        this.props.voterKey,
      );
    }
  }

  render() {
    const buttonDisabled = this.state.selectedVote === undefined ||
      (this.props.votes.some(vote => vote.voter === this.props.voterKey));

    return (
      <div className="VotingMenu">
        <Alternatives
          alternatives={this.props.alternatives}
          handleChange={(...a) => this.handleChange(...a)}
          selectedVote={this.state.selectedVote}
        />
        <Button
          background
          size="lg"
          onClick={() => this.handleClick(...a)}
          disabled={buttonDisabled}
        >
          Submit vote
        </Button>
      </div>
    );
  }
}

VotingMenu.defaultProps = {
  voterKey: undefined,
  alternatives: [],
  issueId: '',
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  issueId: React.PropTypes.string,

  votes: React.PropTypes.arrayOf(React.PropTypes.shape({
    alternative: React.PropTypes.string,
    id: React.PropTypes.string,
  })).isRequired,

  voterKey: React.PropTypes.number,
};

export default VotingMenu;
