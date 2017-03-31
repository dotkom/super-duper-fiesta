import { combineReducers } from 'redux';
import auth from './auth';
import issues from './issues';
import meeting from './meeting';
import voterKey from './voterKey';
import votedState from './votedState';
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
  auth,
  issues,
  meeting,
  voterKey,
  votingEnabled,
  registrationEnabled,
  userFilter,
  users,
  votedState,

  resolutionType,
  questionType,
  issueFormAlternativeText,
  createIssueAlternatives,
  issueSettings,
});

export default votingApp;
