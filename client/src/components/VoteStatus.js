import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import VoteCounter from '../components/VoteCounter';
import Alternative from './Alternative';
import getShuffledAlternatives from '../selectors/getShuffledAlternatives';
import { getIssue } from '../selectors/issues';
import '../css/VoteStatus.css';

const VoteStatus = ({ voteCount, userCount, alternatives, votePercentages }) => (
  <div className="VoteStatus">
    <VoteCounter label="Stemmer totalt" count={voteCount} total={userCount} />

    {alternatives && alternatives.map((alternative, i) =>
      <VoteCounter
        label={`Alternativ ${i + 1}`}
        count={votePercentages[alternative.id]}
        key={alternative.id}
        total={userCount}
      />,
    )}

  </div>
);

VoteStatus.defaultProps = {
  alternatives: undefined,
};

VoteStatus.propTypes = {
  voteCount: VoteCounter.propTypes.count.isRequired,
  userCount: VoteCounter.propTypes.total.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape(Alternative.propTypes)),
  votePercentages: PropTypes.objectOf(PropTypes.number).isRequired,
};

const mapStateToProps = (state) => {
  const currentIssue = getIssue(state);

  // The number of votes on the current issue.
  const voteCount = currentIssue && currentIssue.votes ? currentIssue.votes.length : 0;

  // The number of users eligible for voting on the current issue.
  const userCount = state.users.filter(u => u.canVote).length;

  const votePercentages = {};

  // Alternatives are shuffled as an attempt to prevent peeking over shoulders
  // to figure out what another person has voted for. This scramble needs
  // to be syncronized between LiveVoteCount and VoteHandler, so we take
  // advantage of the memoizing provided by reselect. This keeps the
  // scrambles in sync and avoids rescrambling unless the
  // available alternatives are changed.
  const alternatives = currentIssue && getShuffledAlternatives(state);

  if (currentIssue && currentIssue.votes) {
    currentIssue.votes.forEach((issue) => {
      votePercentages[issue.alternative] = (votePercentages[issue.alternative] || 0) + 1;
    });
  }

  return { voteCount, userCount, alternatives, votePercentages };
};

export default VoteStatus;
export const VoteStatusContainer = connect(
  mapStateToProps,
)(VoteStatus);
