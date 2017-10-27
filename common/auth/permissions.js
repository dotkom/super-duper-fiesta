const IS_LOGGED_IN = 1; // Ikke stemmeberettige, men autoriserte brukere
const IS_LOGGED_IN_DISPLAY = 'Ingen';
const CAN_VOTE = 5;
const CAN_VOTE_DISPLAY = 'Stemmerett';
const IS_MANAGER = 10;
const IS_MANAGER_DISPLAY = 'Tellekorps';
const IS_SUPERUSER = 100;
const IS_SUPERUSER_DISPLAY = 'Dotkom';

const userIsAdmin = user => user.permissions >= IS_MANAGER;

function getPermissionDisplay(permissions) {
  switch (permissions) {
    case IS_LOGGED_IN: return IS_LOGGED_IN_DISPLAY;
    case CAN_VOTE: return CAN_VOTE_DISPLAY;
    case IS_MANAGER: return IS_MANAGER_DISPLAY;
    case IS_SUPERUSER: return IS_SUPERUSER_DISPLAY;
    default: return IS_LOGGED_IN_DISPLAY;
  }
}

module.exports = {
  IS_LOGGED_IN,
  CAN_VOTE,
  IS_MANAGER,
  IS_SUPERUSER,
  IS_LOGGED_IN_DISPLAY,
  CAN_VOTE_DISPLAY,
  IS_MANAGER_DISPLAY,
  IS_SUPERUSER_DISPLAY,
  getPermissionDisplay,
  userIsAdmin,
};
