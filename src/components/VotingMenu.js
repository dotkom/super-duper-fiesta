import React from 'react';
import Alternatives from './Alternatives';
import arrayShuffle from 'array-shuffle';
import '../css/VotingMenu.css';

class VotingMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedVote: undefined,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
        this.props.id,
        parseInt(this.state.selectedVote, 10),
        this.props.voterKey,
      );
    }
  }

  render() {
    const buttonDisabled = !this.state.selectedVote ||
      (this.props.votes.some(vote => vote.voter === this.props.voterKey));

    return (
      <div className="VotingMenu">
        <Alternatives
          alternatives={arrayShuffle(this.props.alternatives)}
          handleChange={this.handleChange}
        />

        <button
          className="VotingMenu-submit"
          onClick={this.handleClick}
          disabled={buttonDisabled}
        >
          Submit vote
        </button>
      </div>
    );
  }
}

VotingMenu.defaultProps = {
  voterKey: undefined,
  alternatives: [],
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  id: React.PropTypes.number.isRequired,

  votes: React.PropTypes.arrayOf(React.PropTypes.shape({
    alternative: React.PropTypes.number,
    id: React.PropTypes.number,
  })).isRequired,

  voterKey: React.PropTypes.number,
};

export default VotingMenu;
