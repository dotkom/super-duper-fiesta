import { ADD_ISSUE_ALTERNATIVE,
  CLEAR_ALTERNATIVE_TEXT,
  REMOVE_ISSUE_ALTERNATIVE,
  SET_ALTERNATIVE_TEXT,
  SET_QUESTION_TYPE,
  SET_RESOLUTION_TYPE,
  UPDATE_ALTERNATIVE_TEXT,
  UPDATE_ISSUE_SETTING,
} from '../actions/createIssueForm';

export const setResolutionType = resolutionType => ({
  type: SET_RESOLUTION_TYPE,
  resolutionType,
});

export const setQuestionType = questionType => ({
  type: SET_QUESTION_TYPE,
  questionType,
});

export const setAlternativeText = text => ({
  type: SET_ALTERNATIVE_TEXT,
  text,
});

export const clearAlternativeText = () => ({
  type: CLEAR_ALTERNATIVE_TEXT,
});

let alternativeCount = 0;

export const addAlternative = text => ({
  type: ADD_ISSUE_ALTERNATIVE,
  id: alternativeCount++,
  text,
});

export const updateAlternativeText = (id, text) => ({
  type: UPDATE_ALTERNATIVE_TEXT,
  id,
  text,
});

export const removeAlternative = id => ({
  type: REMOVE_ISSUE_ALTERNATIVE,
  id,
});

export const updateSetting = (id, value) => ({
  type: UPDATE_ISSUE_SETTING,
  id,
  value,
});
