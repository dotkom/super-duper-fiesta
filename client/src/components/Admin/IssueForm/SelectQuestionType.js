import React, { PropTypes } from 'react';

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

export default SelectQuestionType;
