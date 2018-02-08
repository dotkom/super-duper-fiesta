function integrationTest() {
  return process.env.SDF_INTEGRATION_TEST && process.env.SDF_INTEGRATION_TEST.toLowerCase() === 'true';
}

function coverageGlobs() {
  const globs = ['server/**/*.js', '!server/migrations/*.js'];
  if (!integrationTest()) {
    globs.push('!server/models/**');
  }

  return globs;
}

function testGlobs() {
  const globs = ['/node_modules/'];

  if (!integrationTest()) {
    globs.push('/(.*)?.integration.js');
  }

  return globs;
}

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './coverage/',
  coverageReporters: ['json', 'lcov', 'text'],
  collectCoverageFrom: coverageGlobs(),
  testPathIgnorePatterns: testGlobs(),
};
