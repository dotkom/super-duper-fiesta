const sillyname = require('sillyname');
const SHA256 = require('crypto-js/sha256');

const idNumberGenerator = (id) => {
  let hashedId = id;
  return () => {
    hashedId = SHA256(hashedId.toString()).toString();
    return parseInt(hashedId, 16) / (16 ** 64);
  };
};

function generateStupidName(id) {
  return sillyname(idNumberGenerator(id));
}

module.exports = generateStupidName;
