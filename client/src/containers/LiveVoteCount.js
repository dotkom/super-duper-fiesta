import React from 'react';
import { connect } from 'react-redux';
import VoteCounter from '../components/VoteCounter';


const LiveVoteCount = ({ voteCount, userCount }) => (
  <div>
    <VoteCounter label="Stemmer totalt" count={voteCount} total={userCount} />
    <VoteCounter label="Alternativ 1" count={3} total={30} />
    <VoteCounter label="Alternativ 2" count={18} total={30} />
    <VoteCounter label="Alternativ 3" count={9} total={30} />
  </div>
);

LiveVoteCount.propTypes = {
  voteCount: VoteCounter.propTypes.count.isRequired,
  userCount: VoteCounter.propTypes.total.isRequired,
};

const mapStateToProps = state => ({
  // The number of votes on the current issue.
  voteCount: state.issues.length ? state.issues[state.issues.length - 1].votes.length : 0,
  // The number of users eligible for voting on the current issue.
  userCount: state.users.filter(u => u.canVote).length,
});

export default connect(
  mapStateToProps,
)(LiveVoteCount);
