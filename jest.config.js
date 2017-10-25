module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './coverage/',
  coverageReporters: ['json', 'lcov', 'text'],
  collectCoverageFrom: ['server/**/*.js', '!server/models/**'],
};
