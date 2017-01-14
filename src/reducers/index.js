import { combineReducers } from 'redux';
import issues from './issues';
import voterKey from './voterKey';
import totalUsers from './totalUsers';

const votingApp = combineReducers({
  issues,
  voterKey,
  totalUsers,
});

export default votingApp;
