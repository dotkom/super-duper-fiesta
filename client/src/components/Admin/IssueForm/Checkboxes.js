import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateSetting } from '../../../actionCreators/createIssueForm.js';


const Checkboxes = ({
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

Checkboxes.propTypes = {
  updateSetting: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.bool).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  values: state.issueSettings,
});

const mapDispatchToProps = dispatch => ({
  updateSetting: (id, value) => {
    dispatch(updateSetting(id, value));
  },
});

export default Checkboxes;
export const CheckboxesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Checkboxes);
