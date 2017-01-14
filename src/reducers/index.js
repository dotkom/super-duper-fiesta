import { combineReducers } from 'redux';
import { issues } from './issues';
import { voterKey } from './voterKey';

const votingApp = combineReducers({
  issues,
  voterKey,
});

export default votingApp;
