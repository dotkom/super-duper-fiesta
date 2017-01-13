import { combineReducers } from 'redux';
import { issues } from './issues';

const votingApp = combineReducers({
  issues,
});

export default votingApp;
