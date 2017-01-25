import React, { PropTypes } from 'react';
import classNames from 'classnames';
import '../css/ConcludedIssue.css';


class ConcludedIssue extends React.Component {
  // Maps over alternatives to see if any of them got majority vote
  static calculateMajority(alternatives, votes, voteDemand) {
    let majority = false;
    const numTotalVotes = votes.length > 0 ? votes.length : 1;
    alternatives.forEach((alternative) => {
      if (votes
        .filter(vote => vote.alternative === alternative._id)
        .length / numTotalVotes >= voteDemand) {
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
        props.voteDemand,
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
    const alternativesClass = classNames('ConcludedIssue-alternatives', {
      'ConcludedIssue-alternatives--hidden': !this.state.visibleAlternatives,
    });
    return (
      <div className={classNames('ConcludedIssue', { 'ConcludedIssue-NotMajority': !this.state.majority })}>
        <button className="ConcludedIssue-toggle" onClick={this.handleClick}>
          {this.props.text}
        </button>
        <ul className={alternativesClass}>
          {this.props.alternatives.map(alternative => (
            <li
              key={alternative._id}
              className={classNames({
                winner: this.props.votes.length && this.props.votes
                  .filter(vote => vote.alternative === alternative._id)
                  .length / this.props.votes.length >= this.props.voteDemand,
              })}
            >
              {alternative.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ConcludedIssue.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
  votes: PropTypes.arrayOf(PropTypes.shape({
    hash: PropTypes.string,
    _id: PropTypes.string,
  })).isRequired,
  voteDemand: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ConcludedIssue;
