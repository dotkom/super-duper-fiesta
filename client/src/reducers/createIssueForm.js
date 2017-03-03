import { ADD_ISSUE_ALTERNATIVE,
  CLEAR_ALTERNATIVE_TEXT,
  REMOVE_ISSUE_ALTERNATIVE,
  SET_ALTERNATIVE_TEXT,
  SET_QUESTION_TYPE,
  SET_RESOLUTION_TYPE,
  UPDATE_ALTERNATIVE_TEXT,
  UPDATE_ISSUE_SETTING,
} from '../actionTypes/createIssueForm';

export const resolutionType = (state = 0, action) => {
  switch (action.type) {
    case SET_RESOLUTION_TYPE:
      return action.resolutionType;

    default:
      return state;
  }
};

export const questionType = (state = 0, action) => {
  switch (action.type) {
    case SET_QUESTION_TYPE:
      return action.questionType;

    default:
      return state;
  }
};

export const issueFormAlternativeText = (state = '', action) => {
  switch (action.type) {
    case SET_ALTERNATIVE_TEXT:
      return action.text;

    case CLEAR_ALTERNATIVE_TEXT:
      return '';

    default:
      return state;
  }
};

const issueAlternative = (state = {}, action) => {
  switch (action.type) {
    case ADD_ISSUE_ALTERNATIVE:
      return {
        id: action.id,
        text: action.text,
      };

    case UPDATE_ALTERNATIVE_TEXT:
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        text: action.text,
      };

    default:
      return state;
  }
};

export const createIssueAlternatives = (state = [], action) => {
  switch (action.type) {
    case ADD_ISSUE_ALTERNATIVE:
      return [
        ...state,
        issueAlternative(undefined, action),
      ];

    case REMOVE_ISSUE_ALTERNATIVE:
      return state.filter(issue => issue.id !== action.id);

    case UPDATE_ALTERNATIVE_TEXT:
      return state.map(issue => issueAlternative(issue, action));

    default:
      return state;
  }
};

const issueSetting = (state = false, action) => {
  switch (action.type) {
    case UPDATE_ISSUE_SETTING:
      return action.value;

    default:
      return state;
  }
};

export const issueSettings = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ISSUE_SETTING:
      return {
        ...state,
        [action.id]: issueSetting(state[action.id], action),
      };

    default:
      return state;
  }
};
