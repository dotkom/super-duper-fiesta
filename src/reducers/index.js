import { combineReducers } from 'redux';
import issues from './issues';
import voterKey from './voterKey';
import totalUsers from './totalUsers';
import votingEnabled from './votingEnabled';
import registrationEnabled from './adminButtons';

const votingApp = combineReducers({
  issues,
  voterKey,
  totalUsers,
  votingEnabled,
  registrationEnabled,
});

export default votingApp;
