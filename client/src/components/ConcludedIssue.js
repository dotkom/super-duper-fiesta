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
      majority: ConcludedIssue.calculateMajority(
        props.alternatives,
        props.votes,
        props.voteDemand,
      ),
    };
  }

  render() {
    return (
      <div className={classNames('ConcludedIssue', { 'ConcludedIssue-NotMajority': !this.state.majority })}>
        <button className="ConcludedIssue-toggle">
          {this.props.text}
        </button>
        <ul className="ConcludedIssue-alternatives">
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
    alternative: PropTypes.number,
    hash: PropTypes.string,
    _id: PropTypes.string,
  })).isRequired,
  voteDemand: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ConcludedIssue;
