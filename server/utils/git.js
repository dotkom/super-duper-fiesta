const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const versionFile = fs.readFileSync(
  path.resolve(__dirname, '../../version.txt'),
  'utf8',
);

function getGitSha() {
  if (versionFile === '$Format:%H$') {
    console.log('loading verison from git');
    return childProcess.execSync('git rev-parse HEAD').toString().trim();
  }
  console.log('loading verison from file');
  return versionFile;
}

module.exports = {
  getGitSha,
};
