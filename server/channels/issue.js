const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addIssue = require('../models/issue').addIssue;
const endIssue = require('../models/issue').endIssue;

module.exports = (socket) => {
  socket.on('action', (data) => {
    const payload = data.data;
    logger.debug('issue payload', { payload, action: data.type });
    switch (data.type) {
      case 'server/ADMIN_CREATE_ISSUE':
        addIssue(payload)
        .then((question) => {
          logger.debug('Added new question. Broadcasting ...', { question: question.description });
          emit(socket, 'OPEN_ISSUE', question, { action: 'open' });
          broadcast(socket, 'OPEN_ISSUE', question, { action: 'open' });
          broadcast(socket, 'ENABLE_VOTING');
        }).catch((err) => {
          logger.error('Adding new question failed.', err);
          emit(socket, 'issue', {}, {
            error: 'Adding new question failed',
          });
        });
        break;
      case 'server/ADMIN_CLOSE_ISSUE': {
        const user = socket.request.user;
        const issue = payload.issue;
        logger.info('Closing issue.', {
          description: issue.description,
          issue: issue._id.toString(), // eslint-disable-line no-underscore-dangle
          user: user.name,
        });
        endIssue(issue, user)
        .catch((err) => {
          logger.error('closing issue failed', err);
          emit(socket, 'issue', {}, {
            error: 'Closing issue failed',
          });
        }).then((updatedIssue) => {
          logger.info('Closed issue.', {
            description: updatedIssue.description,
            issue: updatedIssue._id.toString(), // eslint-disable-line no-underscore-dangle
            response: updatedIssue._id.toString(), // eslint-disable-line no-underscore-dangle
          });
          broadcast(socket, 'DISABLE_VOTING');
          broadcast(socket, 'CLOSE_ISSUE', updatedIssue);
          emit(socket, 'CLOSE_ISSUE', updatedIssue);
        });
        break;
      }
      default:
        break;
    }
  });
};
