const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addQuestion = require('../models/issue').addQuestion;
const endQuestion = require('../models/issue').endQuestion;
const getUserByUsername = require('../models/user').getUserByUsername;

module.exports = (socket) => {
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
      case 'server/ADMIN_CLOSE_ISSUE': {
        const adminUser = payload.user;
        const issue = payload.issue;
        if (!adminUser) {
          logger.debug('Someone tried to close an issue without passing user object.', { issue });
          emit(socket, 'issue', {}, {
            error: 'User id required to be able to close an ongoing issue.',
          });
          return null;
        }
        logger.info('Closing issue.', { issue, adminUser });
        getUserByUsername(adminUser).then((user) => {
          logger.debug('Fetched user profile', { username: user.name, permissions: user.permissions });
          endQuestion(issue, user)
          .catch((err) => {
            logger.error('closing issue failed', { err });
            emit(socket, 'issue', {}, {
              error: 'Closing issue failed',
            });
          }).then((updatedIssue) => {
            logger.info('closed issue', { issue: issue.id, response: updatedIssue._id });
            broadcast(socket, 'CLOSE_ISSUE', updatedIssue);
            emit(socket, 'CLOSE_ISSUE', updatedIssue);
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
      }
      default:
        logger.warn('Hit default case for issue.');
        break;
    }
    return null;
  });
};
