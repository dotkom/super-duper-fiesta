import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import css from './LastVotes.css';
import { voteWithNameSelector } from '../selectors/voting';

const LastVotes = ({ votes }) => (
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

LastVotes.propTypes = {
  votes: PropTypes.shape({
    voter: PropTypes.string.isRequired,
    alternative: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  votes: voteWithNameSelector(state).slice(0, 5),
});

export default connect(mapStateToProps)(LastVotes);
