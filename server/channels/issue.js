const { broadcast, emit } = require('../utils');
const logger = require('../logging');

const { addIssue, endIssue, deleteIssue } = require('../models/issue');

const {
  ADMIN_CLOSE_ISSUE,
  ADMIN_CREATE_ISSUE,
  ADMIN_DELETE_ISSUE,
} = require('../../common/actionTypes/adminButtons');
const { CLOSE_ISSUE, OPEN_ISSUE, DELETED_ISSUE } = require('../../common/actionTypes/issues');
const { DISABLE_VOTING, ENABLE_VOTING } = require('../../common/actionTypes/voting');

const createIssue = async (socket, payload) => {
  await addIssue(payload)
  .then((question) => {
    logger.debug('Added new question. Broadcasting ...', { question: question.description });
    emit(socket, OPEN_ISSUE, question, { action: 'open' });
    broadcast(socket, OPEN_ISSUE, question, { action: 'open' });
    broadcast(socket, ENABLE_VOTING);
  }).catch((err) => {
    logger.error('Adding new question failed.', err);
    emit(socket, 'issue', {}, {
      error: 'Adding new question failed',
    });
  });
};

const closeIssue = async (socket, payload) => {
  const user = socket.request.user;
  const issue = payload.issue;
  logger.info('Closing issue.', {
    description: issue.description,
    issue: issue.toString(), // eslint-disable-line no-underscore-dangle
    user: user.name,
  });
  await endIssue(issue, user)
  .then((updatedIssue) => {
    logger.info('Closed issue.', {
      description: updatedIssue.description,
      issue: updatedIssue._id.toString(), // eslint-disable-line no-underscore-dangle
      response: updatedIssue._id.toString(), // eslint-disable-line no-underscore-dangle
    });
    broadcast(socket, DISABLE_VOTING);
    broadcast(socket, CLOSE_ISSUE, updatedIssue);
    emit(socket, CLOSE_ISSUE, updatedIssue);
  })
  .catch((err) => {
    logger.error('closing issue failed', err);
    emit(socket, 'issue', {}, {
      error: 'Closing issue failed',
    });
  });
};

const adminDeleteIssue = async (socket, payload) => {
  const user = socket.request.user;
  const issue = payload.issue;
  logger.info('Deleting issue.', {
    description: issue.description,
    issue: issue.toString(), // eslint-disable-line no-underscore-dangle
    user: user.name,
  });
  const deletedIssue = await deleteIssue(issue, socket.request.user);
  broadcast(socket, DISABLE_VOTING);
  broadcast(socket, CLOSE_ISSUE, deletedIssue);
  emit(socket, CLOSE_ISSUE, deletedIssue);
  broadcast(socket, DELETED_ISSUE, deletedIssue);
  emit(socket, DELETED_ISSUE, deletedIssue);
};

const listener = (socket) => {
  socket.on('action', async (data) => {
    const payload = data.data;
    logger.debug('issue payload', { payload, action: data.type });
    switch (data.type) {
      case ADMIN_CREATE_ISSUE:
        createIssue(socket, payload);
        break;
      case ADMIN_CLOSE_ISSUE: {
        closeIssue(socket, payload);
        break;
      }
      case ADMIN_DELETE_ISSUE: {
        adminDeleteIssue(socket, payload);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  createIssue,
  closeIssue,
  adminDeleteIssue,
};
