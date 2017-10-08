const SHA256 = require('crypto-js/sha256');

function hashWithSalt(password, salt) {
  return SHA256(password + salt).toString();
}

module.exports = {
  hashWithSalt,
};
