import React from 'react';

export default ({ userCount, voteCount }) => (
  <div className="LiveCount">
    <p>Stemmer: <b>{voteCount}</b> av <b>{userCount}</b> </p>
  </div>
);
