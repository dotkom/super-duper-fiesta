import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import VoteCounter from '../components/VoteCounter';
import Alternative from './Alternative';
import { getShuffledAlternatives } from '../selectors/alternatives';
import { activeIssueExists, getIssue, getIssueKey } from '../selectors/issues';
import css from './VoteStatus.css';
import { VOTING_NOT_STARTED } from '../../../common/actionTypes/issues';

const VoteStatus = ({
  activeIssue, voteCount, userCount, alternatives, votePercentages, showOnlyWinner, issueStatus,
  }) => (
    <div className={css.status}>
      {activeIssue &&
        <VoteCounter label="Stemmer totalt" count={voteCount} total={userCount} />}

      {issueStatus !== VOTING_NOT_STARTED
      ? (!showOnlyWinner && alternatives) &&
        alternatives.map(alternative =>
          <VoteCounter
            label={alternative.text}
            count={votePercentages[alternative.id]}
            key={alternative.id}
            total={voteCount}
          />,
      )
      : <p>Voteringen har ikke startet.</p>
      }

    </div>
);

VoteStatus.defaultProps = {
  alternatives: undefined,
  userCount: 0,
  showOnlyWinner: false,
  issueStatus: VOTING_NOT_STARTED,
};

VoteStatus.propTypes = {
  activeIssue: PropTypes.bool.isRequired,
  voteCount: VoteCounter.propTypes.count.isRequired,
  userCount: VoteCounter.propTypes.total,
  alternatives: PropTypes.arrayOf(PropTypes.shape(Alternative.propTypes)),
  showOnlyWinner: PropTypes.bool,
  votePercentages: PropTypes.objectOf(PropTypes.number).isRequired,
  issueStatus: PropTypes.string,
};

const mapStateToProps = (state) => {
  const currentIssue = getIssue(state);

  // The number of votes on the current issue.
  const voteCount = currentIssue && currentIssue.votes ? Object.keys(currentIssue.votes).length : 0;

  // The number of users eligible for voting on the current issue.
  const userCount = currentIssue ? currentIssue.qualifiedVoters : 0;

  const votePercentages = {};

  // Alternatives are shuffled as an attempt to prevent peeking over shoulders
  // to figure out what another person has voted for. This scramble needs
  // to be syncronized between LiveVoteCount and VoteHandler, so we take
  // advantage of the memoizing provided by reselect. This keeps the
  // scrambles in sync and avoids rescrambling unless the
  // available alternatives are changed.
  const alternatives = currentIssue && getShuffledAlternatives(state);

  if (currentIssue && currentIssue.votes) {
    Object.keys(currentIssue.votes).forEach((key) => {
      const issue = currentIssue.votes[key];
      votePercentages[issue.alternative] = (votePercentages[issue.alternative] || 0) + 1;
    });
  }

  return {
    activeIssue: activeIssueExists(state),
    voteCount,
    userCount,
    alternatives,
    votePercentages,
    showOnlyWinner: currentIssue && currentIssue.showOnlyWinner,
    issueStatus: getIssueKey(state, 'status'),
  };
};

export default VoteStatus;
export const VoteStatusContainer = connect(
  mapStateToProps,
)(VoteStatus);
