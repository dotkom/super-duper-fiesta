import React from 'react';
import PropTypes from 'prop-types';

const SelectQuestionType = ({ questionType, handleQuestionTypeChange }) => (
  <select
    onChange={e => handleQuestionTypeChange(e.target.value)}
    value={questionType}
  >
    <option value="YES_NO">Ja/Nei</option>
    <option value="MULTIPLE_CHOICE">Flervalg</option>
  </select>
);

SelectQuestionType.propTypes = {
  handleQuestionTypeChange: PropTypes.func.isRequired,
  questionType: PropTypes.string.isRequired,
};

export default SelectQuestionType;
