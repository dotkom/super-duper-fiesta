import React, { PropTypes } from 'react';
import classNames from 'classnames';
import IconText from './IconText';
import Card from './Card';
import { getResolutionTypeDisplay, RESOLUTION_TYPES } from '../actionTypes/voting';
import css from './ConcludedIssue.css';

const ConcludedIssue = ({ majority, voteDemand, text, alternatives, votes }) => (
  <Card
    classes={css.concludedIssue}
    headerColor={majority ? 'green' : 'red'}
    title={text}
    corner={
      <IconText
        text={majority ? 'Vedtatt' : 'Avvist'}
        iconClass={majority ? css.majorityIcon : css.minorityIcon}
      />
    }
    subtitle={`Flertallskrav: ${getResolutionTypeDisplay(voteDemand).name} (${getResolutionTypeDisplay(voteDemand).voteDemandText})`}
  >
    <ul className={css.alternatives}>
      {alternatives.map(alternative => (
        <li
          key={alternative.id}
          className={classNames({
            [css.alternativesWinner]: Object.keys(votes).length
            && Object.keys(votes)
              .map(key => votes[key])
              .filter(vote => vote.alternative === alternative.id)
              .length / Object.keys(votes).length >= voteDemand,
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
  text: React.PropTypes.string.isRequired,
  alternatives: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    _id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
  })).isRequired,
  votes: React.PropTypes.objectOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    alternative: React.PropTypes.string,
    voter: React.PropTypes.string,
  })),
};


export default ConcludedIssue;
