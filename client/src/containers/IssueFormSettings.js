import { connect } from 'react-redux';
import { updateSetting } from '../actions/createIssueForm.js';
import IssueFormCheckboxes from '../components/IssueFormCheckboxes';

const mapStateToProps = state => ({
  values: state.issueSettings,
});

const mapDispatchToProps = dispatch => ({
  updateSetting: (id, value) => {
    dispatch(updateSetting(id, value));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueFormCheckboxes);
