import { connect } from 'react-redux';
import SelectQuestionType from '../components/Admin/IssueForm/SelectQuestionType';
import { setQuestionType } from '../actionCreators/createIssueForm';

const mapStateToProps = state => ({
  questionType: state.questionType,
});

const mapDispatchToProps = dispatch => ({
  handleQuestionTypeChange: (resolutionType) => {
    dispatch(setQuestionType(resolutionType));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectQuestionType);
