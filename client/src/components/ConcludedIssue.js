import React, { PropTypes } from 'react';
import classNames from 'classnames';
import IconText from './IconText';
import Card from './Card';
import { getResolutionTypeDisplay, RESOLUTION_TYPES } from '../actionTypes/voting';
import css from './ConcludedIssue.css';

const ConcludedIssue = ({ majority, voteDemand }) => (
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
    subtitle={`Flertallskrav: ${getResolutionTypeDisplay(voteDemand).name} (${getResolutionTypeDisplay(voteDemand).voteDemandText})`}
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
              .length / Object.keys(this.props.votes).length >= voteDemand,
          })}
        >
          {alternative.text}
        </li>
      ))}
    </ul>
  </Card>
);

ConcludedIssue.defaultProps = {
  alternatives: [],
  votes: {},
  voteDemand: RESOLUTION_TYPES.regular.voteDemand,
  text: 'Denne saken har ingen tittel.',
};

ConcludedIssue.propTypes = {
  voteDemand: PropTypes.oneOfType(
    [PropTypes.number, PropTypes.string]), // Kept for backwards compatibility. 'oldResolutionTypes'
  majority: PropTypes.bool.isRequired,
};


export default ConcludedIssue;
