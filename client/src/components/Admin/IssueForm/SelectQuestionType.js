import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setQuestionType } from '../../../actionCreators/createIssueForm';

const SelectQuestionType = ({ questionType, handleQuestionTypeChange }) => (
  <select
    onChange={e => handleQuestionTypeChange(parseInt(e.target.value, 10))}
    value={questionType}
  >
    <option value={0}>Ja/Nei</option>
    <option value={1}>Flervalg</option>
  </select>
);

SelectQuestionType.propTypes = {
  handleQuestionTypeChange: PropTypes.func.isRequired,
  questionType: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  questionType: state.questionType,
});

const mapDispatchToProps = dispatch => ({
  handleQuestionTypeChange: (resolutionType) => {
    dispatch(setQuestionType(resolutionType));
  },
});

export default SelectQuestionType;
export const SelectQuestionTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectQuestionType);
