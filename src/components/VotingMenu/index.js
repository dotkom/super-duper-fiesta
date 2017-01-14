import React from 'react';

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
    this.props.handleVote(this.props.id, parseInt(this.state.selectedVote, 10));
  }

  render() {
    return (
      <div className="VotingMenu">
        <div className="Alternatives">
          {this.props.alternatives.map(alternative => (
            <div className="Alternative" key={alternative.id}>
              <input
                type="radio"
                name="vote"
                value={alternative.id}
                id={alternative.id}
                onChange={this.handleChange}
              />

              <label htmlFor={alternative.id}>{alternative.text}</label>
            </div>
          ))}
        </div>

        <button onClick={this.handleClick} disabled={!this.state.selectedVote}>Submit vote</button>
      </div>
    );
  }
}

VotingMenu.propTypes = {
  alternatives: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    text: React.PropTypes.string,
  })).isRequired,

  handleVote: React.PropTypes.func.isRequired,
  id: React.PropTypes.number.isRequired,
};

export default VotingMenu;
