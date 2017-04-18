import React, { PropTypes } from 'react';
import classNames from 'classnames';
import IconText from './IconText';
import Card from './Card';
import css from './ConcludedIssue.css';


class ConcludedIssue extends React.Component {
  // Maps over alternatives to see if any of them got majority vote
  static calculateMajority(alternatives, votes, voteDemand) {
    let majority = false;
    const numTotalVotes = Object.keys(votes).length;
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      majority: ConcludedIssue.calculateMajority(
        nextProps.alternatives,
        nextProps.votes,
        nextProps.voteDemand,
      ),
    });
  }

  render() {
    const { majority } = this.state;
    return (
      <Card
        classes={css.concludedIssue}
        headerColor={majority ? 'green' : 'red'}
        title={this.props.text}
        corner={
          <IconText
            text={majority ? 'Vedtatt' : 'Avvist'}
            iconClass={majority ? css.majorityIcon : css.minorityIcon}
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

ConcludedIssue.defaultProps = {
  alternatives: [],
  votes: {},
  voteDemand: 0,
  text: 'Denne saken har ingen tittel.',
};

ConcludedIssue.propTypes = {
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
  votes: PropTypes.shape({
    alternative: PropTypes.string.isRequired,
    voter: PropTypes.string.isRequired,
  }),
  voteDemand: PropTypes.number,
  text: PropTypes.string,
};


export default ConcludedIssue;
