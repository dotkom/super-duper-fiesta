const childProcess = require('child_process');

function getGitSha() {
  return childProcess.execSync('git rev-parse HEAD').toString().trim();
}

module.exports = {
  getGitSha,
};
