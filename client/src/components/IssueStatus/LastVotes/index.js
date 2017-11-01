import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import css from './LastVotes.css';
import { voteWithNameSelector } from '../../../selectors/voting';
import { activeIssueExists, getOwnVote, getIssueKey } from '../../../selectors/issues';

const LastVotes = ({ votes, hideVotes }) => {
  if (hideVotes) {
    return null;
  }
  return (
    <div className={css.component}>
      <h3>Siste stemmer</h3>
      { votes.length > 0 ? votes.map(vote => (
        <div className={css.vote}>
          { vote.voter }: { vote.alternative }
        </div>
      ))
      : (
        <div>Ingen stemmer enda</div>
      )}
    </div>
  );
};

LastVotes.propTypes = {
  votes: PropTypes.shape({
    voter: PropTypes.string.isRequired,
    alternative: PropTypes.string.isRequired,
  }).isRequired,
  hideVotes: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  votes: voteWithNameSelector(state).slice(0, 5),
  hideVotes: (
    !activeIssueExists(state)
    || !getOwnVote(state, state.auth.id)
    || getIssueKey(state, 'showOnlyWinner')
  ),
});

export default connect(mapStateToProps)(LastVotes);
