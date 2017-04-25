import React, { PropTypes } from 'react';
import classNames from 'classnames';
import IconText from './IconText';
import Card from './Card';
import { getResolutionTypeDisplay, RESOLUTION_TYPES } from '../../../common/actionTypes/voting';
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
            [css.alternativesWinner]:
              majority
              && Object.keys(votes).length
              && Object.keys(votes)
                .map(key => votes[key])
                .filter(vote => vote.alternative === alternative.id)
                .length / Object.keys(votes).length > RESOLUTION_TYPES[voteDemand].voteDemand,
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
  text: PropTypes.string.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  votes: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    alternative: PropTypes.string,
    voter: PropTypes.string,
  })),
};


export default ConcludedIssue;
