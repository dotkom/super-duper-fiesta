const { randomNoun, randomAdjective } = require('sillyname');
const SHA256 = require('crypto-js/sha256');

const idNumberGenerator = id => () => parseInt(SHA256(id.toString()).toString(), 16) / (16 ** 64);

function generateStupidName(id) {
  const generator = idNumberGenerator(id);
  const noun1 = randomNoun(generator);
  let noun2 = randomNoun(1 - generator);
  noun2 = noun2.substr(0, 1).toUpperCase() + noun2.substr(1);
  const adjective = randomAdjective(generator);
  return `${adjective}${noun1} ${noun2}`;
}

module.exports = generateStupidName;
