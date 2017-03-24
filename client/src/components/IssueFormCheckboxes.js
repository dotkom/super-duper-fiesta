import React, { PropTypes } from 'react';

const IssueFormCheckboxes = ({
  countBlankVotes, secretVoting, showOnlyWinner,
  handleUpdateCountBlankVotes, handleUpdateSecretVoting, handleUpdateShowOnlyWinner
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

IssueFormCheckboxes.propTypes = {
  updateSetting: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default IssueFormCheckboxes;
