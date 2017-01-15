import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/ConcludedIssue.css';


class ConcludedIssue extends React.Component {
  // Maps over alternatives to see if any of them got majority vote
  static calculateMajority(alternatives, votes, majorityTreshold) {
    let majority = false;
    alternatives.forEach((alternative) => {
      if (votes
        .filter(vote => vote.alternative === alternative.id)
        .length / votes.length >= majorityTreshold) {
        majority = true;
      }
    });
    return majority;
  }

  constructor(props) {
    super(props);

    this.state = {
      visibleAlternatives: false,
      majority: ConcludedIssue.calculateMajority(
        props.alternatives,
        props.votes,
        props.majorityTreshold,
      ),
    };
    this.handleClick = this.handleClick.bind(this);
  }


  // CLicking the issue should show/hide the answers
  handleClick() {
    this.setState({
      visibleAlternatives: !this.state.visibleAlternatives,
    });
  }


  render() {
    return (
      <button
        className={classNames('ConcludedIssue', { 'ConcludedIssue-NotMajority': !this.state.majority })}
        onClick={this.handleClick}
      >
        <p>{this.props.text}</p>
        <ul className={classNames({ hidden: !this.state.visibleAlternatives })}>
          {this.props.alternatives.map(alternative => (
            <li
              key={alternative.id}
              className={classNames({
                winner: this.props.votes.length && this.props.votes
                  .filter(vote => vote.alternative === alternative.id)
                  .length / this.props.votes.length >= this.props.majorityTreshold,
              })}
            >
              {alternative.text}
            </li>
          ))}
        </ul>
      </button>
    );
  }
}

ConcludedIssue.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.object).isRequired,
  votes: PropTypes.arrayOf(PropTypes.object).isRequired,
  majorityTreshold: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ConcludedIssue;
