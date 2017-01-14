import React from 'react';
import classNames from 'classnames';
import './ConcludedIssue.css';

const ConcludedIssue = ({ text, alternatives, votes, majorityTreshold, totalUsers }) => (
  <div className="ConcludedIssue">
    <p>{text}</p>
    <ul>
      {alternatives.map(alternative => (
        <li
          key={alternative.id}
          className={classNames({
            winner: votes.length && votes
              .filter(vote => vote.alternative === alternative.id)
              .length / votes.length >= majorityTreshold,
          })}
        >
          {alternative.text}
        </li>
      ))}
    </ul>
  </div>
);

export default ConcludedIssue;
