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
          handleChange={this.handleChange}
          selectedVote={this.state.selectedVote}
        />
        <Button
          size="lg"
          onClick={this.handleClick}
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
  _id: '',
};

VotingMenu.propTypes = {
  alternatives: Alternatives.propTypes.alternatives,
  handleVote: React.PropTypes.func.isRequired,
  _id: React.PropTypes.string,

  votes: React.PropTypes.arrayOf(React.PropTypes.shape({
    alternative: React.PropTypes.string,
    _id: React.PropTypes.string,
  })).isRequired,

  voterKey: React.PropTypes.number,
};

export default VotingMenu;
