import React, { PropTypes } from 'react';

const IssueFormCheckboxes = ({ values, updateSetting }) => (
  <div className="IssueFormCheckboxes">
    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => updateSetting(0, e.target.checked)}
        value={values[0]}
      />
      Hemmelig valg
    </label>

    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => updateSetting(1, e.target.checked)}
        value={values[1]}
      />
      Vis kun vinner
    </label>

    <label className="IssueForm-checkbox">
      <input
        type="checkbox"
        onChange={e => updateSetting(2, e.target.checked)}
        value={values[2]}
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
