import React from 'react';

const VotingMenu = ({ alternatives }) => (
  <div className="VotingMenu">
    <ul>
      {alternatives.map(alternative =>
        <li key={alternative.id}>{alternative.text}</li>,
      )}
    </ul>
    <button>Submit vote</button>
  </div>
);

VotingMenu.propTypes = {
  alternatives: React.PropTypes.arrayOf(React.propTypes.shape({
    id: React.PropTypes.number,
    text: React.PropTypes.string,
  })).isRequired,
};

export default VotingMenu;
