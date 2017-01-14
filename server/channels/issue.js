const logger = require('../logging');

const issue = (data) => {
  logger.debug('issue data', data);
  if (data.action === 'open') {
    logger.info('received issue open');
  }
  if (data.action === 'close') {
    logger.info('received issue close');
  }
};

module.exports = issue;
