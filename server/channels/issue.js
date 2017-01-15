const logger = require('../logging');

const addQuestion = require('../helpers').addQuestion;
const endQuestion = require('../helpers').endQuestion;
const getUserById = require('../helpers').getUserById;

const issue = (socket) => {
  socket.on('issue', (data) => {
    const payload = data.data;
    logger.debug('issue payload', { payload, action: data.action });
    if (data.action === 'open') {
      addQuestion(data)
      .then((question) => {
        logger.debug('Added new question. Broadcasting ...', { question: question.description });
        socket.broadcast.emit('issue', question);
        return null;
      }).catch((err) => {
        logger.error('Adding new question failed.', { err });
        return null;
      });
      return null;
    } else if (data.action === 'close') {
      if (!data.user) {
        socket.emit('issue', {
          error: 'User id required to be able to close an ongoing issue.',
        });
        return null;
      }
      logger.info('Closing issue.', { issue: data._id, user: data.user });
      getUserById(data.user).then((user) => {
        logger.debug('Fetched user profile', { user: user.name });
        endQuestion(data._id, user)
        .catch((err) => {
          logger.error('closing issue failed', { err });
        }).then((d) => {
          logger.info('closed question', { question: d._id });
          socket.broadcast.emit('issue', data);
        });
        return null;
      }).catch((err) => {
        logger.error('getting user failed', { err });
        return null;
      });
      return null;
    }
    return null;
  });
};

module.exports = issue;
