import version from './version/reducer';
import auth from './auth/reducer';
import issues from './issue/reducer';
import meeting from './meeting/reducer';
import voterKey from './voterKey/reducer';
import votingEnabled from './votingEnabled/reducer';
import registrationEnabled from './adminButtons/reducer';
import userFilter from './userFilter/reducer';
import users from './user/reducer';
import error from './error/reducer';
import userSettings from './userSettings/reducer';
import lastVotes from './lastVotes/reducer';

const votingApp = {
  auth,
  issues,
  meeting,
  voterKey,
  votingEnabled,
  registrationEnabled,
  userFilter,
  users,
  version,
  error,
  userSettings,
  lastVotes,
};

export default votingApp;
