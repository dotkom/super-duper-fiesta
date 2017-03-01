import React, { PropTypes } from 'react';
import VoteCounter from '../components/VoteCounter';
import Alternative from './Alternative';

const VoteStatus = ({ voteCount, userCount, alternatives, votePercentages }) => (
  <div>
    <VoteCounter label="Stemmer totalt" count={voteCount} total={userCount} />

    {alternatives && alternatives.map((alternative, i) =>
      <VoteCounter
        label={`Alternativ ${i + 1}`}
        count={votePercentages[alternative._id]}
        key={alternative._id}
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

export default VoteStatus;
