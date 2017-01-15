const logger = require('../logging');

const issue = (socket) => {
  socket.on('issue', (data) => {
    logger.debug('issue data', data);
    if (data.action === 'open') {
      logger.info('received issue open');
      socket.broadcast.emit('issue', data);
    }
    if (data.action === 'close') {
      logger.info('received issue close');
      socket.broadcast.emit('issue', data);
    }
  });
};

module.exports = issue;
