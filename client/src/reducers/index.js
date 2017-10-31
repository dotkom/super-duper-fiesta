import version from './version';
import auth from './auth';
import issues from './issues';
import meeting from './meeting';
import voterKey from './voterKey';
import votingEnabled from './votingEnabled';
import registrationEnabled from './adminButtons';
import userFilter from './userFilter';
import users from './users';
import error from './error';
import userSettings from './userSettings';

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
};

export default votingApp;
