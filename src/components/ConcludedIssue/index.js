import React from 'react';

export default ({ text, alternatives, votes, majorityTreshold, totalUsers }) => (
  <div className="ConcludedIssue">
    <p>{text}</p>
    {alternatives.map(alternative => (
      <progress
        key={alternative.id}
        value={votes.filter(vote => vote.alternative === alternative.id).length / votes.length}
      />
    ))}
  </div>
);
