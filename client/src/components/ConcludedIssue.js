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
        .filter(vote => vote.alternative === alternative.id)
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
    const { majority } = this.state;
    return (
      <div className={classNames('ConcludedIssue', { 'ConcludedIssue--majority': majority })}>
        <div className="ConcludedIssue-top">
          <h2 className="ConcludedIssue-title">
            {this.props.text}
          </h2>
          <div
            title={majority ? 'Flertall' : 'Ikke flertall'}
            className={classNames('ConcludedIssue-status', {
              'flaticon-success': majority,
              'flaticon-close': !majority,
            })}
          />
        </div>
        <div className="ConcludedIssue-content">
          <p><b>Flertallskrav</b>: Alminnelig (1/2)</p>
          <ul className="ConcludedIssue-alternatives">
            {this.props.alternatives.map(alternative => (
              <li
                key={alternative.id}
                className={classNames({
                  'ConcludedIssue-alternatives--winner': this.props.votes.length && this.props.votes
                    .filter(vote => vote.alternative === alternative.id)
                    .length / this.props.votes.length >= this.props.voteDemand,
                })}
              >
                {alternative.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

ConcludedIssue.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
  votes: PropTypes.arrayOf(PropTypes.shape({
    alternative: PropTypes.string,
    hash: PropTypes.string,
    id: PropTypes.string,
  })).isRequired,
  voteDemand: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ConcludedIssue;
