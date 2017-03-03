import { connect } from 'react-redux';
import { setAlternativeText, addAlternative, clearAlternativeText, removeAlternative, updateAlternativeText } from '../actionCreators/createIssueForm';
import IssueFormAlternative from '../components/IssueFormAlternative';

const mapStateToProps = state => ({
  alternativeText: state.issueFormAlternativeText,
  // Display the component if the question type is set to multiple choice.
  display: state.questionType === 1,
  alternatives: state.createIssueAlternatives,
});

const mapDispatchToProps = dispatch => ({
  alternativeUpdate: (text) => {
    dispatch(setAlternativeText(text));
  },

  addAlternative: (text) => {
    dispatch(addAlternative(text));
    dispatch(clearAlternativeText());
  },

  updateAlternativeText: (id, text) => {
    dispatch(updateAlternativeText(id, text));
  },

  removeAlternative: (id) => {
    dispatch(removeAlternative(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueFormAlternative);
