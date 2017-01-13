import React from 'react';

export default ({ alternatives }) => (
  <div className="Voting">
    {alternatives.map((alternative) =>
      <p> Ÿ {alternative}</p>
    )}

    <p> this will be a button: Submit vote</p>
  </div>
);
