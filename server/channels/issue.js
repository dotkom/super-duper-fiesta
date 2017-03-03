const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addQuestion = require('../models/issue').addQuestion;
const endQuestion = require('../models/issue').endQuestion;
const getUserById = require('../models/user').getUserById;

const issue = (socket) => {
  socket.on('action', (data) => {
    const payload = data.data;
    logger.debug('issue payload', { payload, action: data.type });
    switch (data.type) {
      case 'server/ADMIN_CREATE_ISSUE':
        addQuestion(payload)
        .then((question) => {
          logger.debug('Added new question. Broadcasting ...', { question: question.description });
          broadcast(socket, 'OPEN_ISSUE', question, { action: 'open' });
          return null;
        }).catch((err) => {
          logger.error('Adding new question failed.', { err });
          emit(socket, 'issue', {}, {
            error: 'Adding new question failed',
          });
          return null;
        });
        return null;
      case 'server/CLOSE_ISSUE':
        if (!data.user) {
          logger.debug('Someone tried to close an issue without passing user object.');
          emit(socket, 'issue', {}, {
            error: 'User id required to be able to close an ongoing issue.',
          });
          return null;
        }
        logger.info('Closing issue.', { issue: payload.id, user: data.user });
        getUserById(data.user).then((user) => {
          logger.debug('Fetched user profile', { user: user.name });
          logger.debug('endq', { t: typeof endQuestion, endQuestion });
          endQuestion(payload.id, user)
          .catch((err) => {
            logger.error('closing issue failed', { err });
            emit(socket, 'issue', {}, {
              error: 'Closing issue failed',
            });
          }).then((d) => {
            logger.info('closed question', { question: payload.id, response: d._id });
            broadcast(socket, 'issue', payload, { action: 'close' });
          });
        }).catch((err) => {
          logger.error('getting user failed', { err });
          emit(socket, 'issue', {}, {
            error: 'Something went wrong. Please try again. If the issue persists,' +
            'try logging in and out again',
          });
          return null;
        });
        return null;
      default:
        logger.warn('Hit default case for issue.');
        break;
    }
    return null;
  });
};

module.exports = issue;
