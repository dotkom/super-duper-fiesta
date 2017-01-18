const IS_LOGGED_IN = 1; // Ikke stemmeberettige, men autoriserte brukere
const CAN_VOTE = 5; // Stemmeberettigede / Onlinere
const IS_MANAGER = 10; // Tellekorps
const IS_SUPERUSER = 100; // Dotkom

module.exports = {
  IS_LOGGED_IN, CAN_VOTE, IS_MANAGER, IS_SUPERUSER,
};
