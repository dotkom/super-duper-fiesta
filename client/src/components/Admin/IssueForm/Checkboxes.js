import React, { PropTypes } from 'react';


const Checkboxes = ({
  countBlankVotes, secretVoting, showOnlyWinner,
  handleUpdateCountBlankVotes, handleUpdateSecretVoting, handleUpdateShowOnlyWinner,
}) => (
  <div className="IssueFormCheckboxes">
    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => handleUpdateSecretVoting(e.target.checked)}
        checked={secretVoting}
      />
      Hemmelig valg
    </label>

    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => handleUpdateShowOnlyWinner(e.target.checked)}
        checked={showOnlyWinner}
      />
      Vis kun vinner
    </label>

    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => handleUpdateCountBlankVotes(e.target.checked)}
        checked={countBlankVotes}
      />
      Tellende blanke stemmer
    </label>
  </div>
);

Checkboxes.propTypes = {
  handleUpdateCountBlankVotes: PropTypes.func.isRequired,
  countBlankVotes: PropTypes.bool.isRequired,
  secretVoting: PropTypes.bool.isRequired,
  showOnlyWinner: PropTypes.bool.isRequired,
  handleUpdateSecretVoting: PropTypes.func.isRequired,
  handleUpdateShowOnlyWinner: PropTypes.func.isRequired,
};

export default Checkboxes;
