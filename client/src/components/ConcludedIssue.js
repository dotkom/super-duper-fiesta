import React, { PropTypes } from 'react';
import classNames from 'classnames';
import IconText from './IconText';
import Card from './Card';
import css from './ConcludedIssue.css';


class ConcludedIssue extends React.Component {
  // Maps over alternatives to see if any of them got majority vote
  static calculateMajority(alternatives, votes, voteDemand) {
    let majority = false;
    const numTotalVotes = votes.length > 0 ? votes.length : 1;
    alternatives.forEach((alternative) => {
      if (Object.keys(votes)
        .map(key => votes[key])
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
      <Card
        classes={classNames(css.concludedIssue,
          {
            [css.majority]: majority,
            [css.minority]: !majority,
          })}
        title={this.props.text}
        corner={
          <IconText
            text={majority ? 'Vedtatt' : 'Avvist'}
            iconClass={majority ? 'flaticon-success' : 'flaticon-warning'}
          />
        }
        subtitle="Flertallskrav: Alminnelig (1/2)"
      >
        <ul className={css.alternatives}>
          {this.props.alternatives.map(alternative => (
            <li
              key={alternative.id}
              className={classNames({
                [css.alternativesWinner]: Object.keys(this.props.votes).length
                && Object.keys(this.props.votes)
                  .map(key => this.props.votes[key])
                  .filter(vote => vote.alternative === alternative.id)
                  .length / Object.keys(this.props.votes).length >= this.props.voteDemand,
              })}
            >
              {alternative.text}
            </li>
          ))}
        </ul>
      </Card>
    );
  }
}

ConcludedIssue.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
  votes: PropTypes.shape({
    alternative: PropTypes.string,
    voter: PropTypes.string,
  }).isRequired,
  voteDemand: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ConcludedIssue;
