const logger = require('../logging');

const addQuestion = require('../helpers').addQuestion;
const endQuestion = require('../helpers').endQuestion;

const issue = (socket) => {
  socket.on('issue', (data) => {
    logger.debug('issue data', data);
    if (data.action === 'open') {
      logger.info('received issue open');
      addQuestion(
        data.description,
        data.options, // Format {description, id}
        data.secret,
        data.showOnlyWinner,
        data.countingBlankVotes,
        data.voteDemand)
      .then((question) => {
        logger.debug('add question works', { question: question.description });
        socket.broadcast.emit('issue', question);
      }).catch((err) => {
        logger.error('add question error on socket', { err });
      });
    }
    if (data.action === 'close') {
      logger.info('received issue close');
      socket.broadcast.emit('issue', data);
    }
  });
};

module.exports = issue;
