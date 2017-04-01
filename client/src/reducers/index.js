import { combineReducers } from 'redux';
import auth from './auth';
import issues from './issues';
import meeting from './meeting';
import voterKey from './voterKey';
import votingEnabled from './votingEnabled';
import registrationEnabled from './adminButtons';
import userFilter from './userFilter';
import users from './users';

const votingApp = combineReducers({
  auth,
  issues,
  meeting,
  voterKey,
  votingEnabled,
  registrationEnabled,
  userFilter,
  users,
});

export default votingApp;
