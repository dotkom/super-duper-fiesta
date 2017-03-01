import { combineReducers } from 'redux';
import issues from './issues';
import meeting from './meeting';
import voterKey from './voterKey';
import votingEnabled from './votingEnabled';
import registrationEnabled from './adminButtons';
import userFilter from './userFilter';
import users from './users';

import {
  resolutionType,
  questionType,
  issueFormAlternativeText,
  createIssueAlternatives,
  issueSettings,
} from './createIssueForm';

const votingApp = combineReducers({
  issues,
  meeting,
  voterKey,
  votingEnabled,
  registrationEnabled,
  userFilter,
  users,

  resolutionType,
  questionType,
  issueFormAlternativeText,
  createIssueAlternatives,
  issueSettings,
});

export default votingApp;
