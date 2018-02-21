const { adminBroadcast, broadcast, broadcastAndEmit, emit, emitError } = require('../utils');
const logger = require('../logging');

const { addIssue, endIssue, deleteIssue, getPublicIssueWithVotes, disableVoting, enableVoting }
  = require('../managers/issue');
const { userIsAdmin } = require('../../common/auth/permissions');

const {
  ADMIN_CLOSE_ISSUE,
  ADMIN_CREATE_ISSUE,
  ADMIN_DELETE_ISSUE,
  ADMIN_DISABLE_VOTING,
  ADMIN_ENABLE_VOTING,
} = require('../../common/actionTypes/adminButtons');
const { CLOSE_ISSUE, OPEN_ISSUE, DELETED_ISSUE } = require('../../common/actionTypes/issues');
const { DISABLE_VOTING, ENABLE_VOTING } = require('../../common/actionTypes/voting');

const createIssue = async (socket, payload) => {
  try {
    const question = await addIssue(payload);
    logger.debug('Added new question. Broadcasting ...', { question: question.description });
    broadcastAndEmit(socket, OPEN_ISSUE, question, { action: 'open' });
  } catch (err) {
    logger.error('Adding new question failed.', err);
    emitError(socket, new Error('Opprettelse av sak feilet'));
  }
};

const closeIssue = async (socket, payload) => {
  const user = await socket.request.user();
  const issue = payload.issue;
  logger.info('Closing issue.', {
    description: issue.description,
    issue: issue.toString(),
    user: user.name,
  });
  try {
    const updatedIssue = await endIssue(issue, user);
    logger.info('Closed issue.', {
      description: updatedIssue.description,
      issue: updatedIssue.id.toString(),
      response: updatedIssue.id.toString(),
    });
    broadcast(socket, DISABLE_VOTING, {
      id: updatedIssue.id,
      status: updatedIssue.status,
    });
    broadcast(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(updatedIssue));
    adminBroadcast(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(updatedIssue, true));
    emit(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(updatedIssue, userIsAdmin(user)));
  } catch (err) {
    logger.error('closing issue failed', err);
    emitError(socket, new Error('Stenging av sak feilet'));
  }
};

const adminDeleteIssue = async (socket, payload) => {
  const user = await socket.request.user();
  const issue = payload.issue;
  logger.info('Deleting issue.', {
    description: issue.description,
    issue: issue.toString(),
    user: user.name,
  });
  const deletedIssue = await deleteIssue(issue, user);
  broadcast(socket, DISABLE_VOTING, {
    id: deletedIssue.id,
    status: deletedIssue.status,
  });
  const publicIssue = await getPublicIssueWithVotes(deletedIssue);
  broadcastAndEmit(socket, CLOSE_ISSUE, publicIssue);
  broadcastAndEmit(socket, DELETED_ISSUE, publicIssue);
};

async function adminDisableVoting(socket, data) {
  const user = await socket.request.user();
  const issue = data.issue;
  logger.debug('Disabling voting', { issue, user: user.name });

  const updatedIssue = await disableVoting({ id: issue }, user);

  broadcastAndEmit(socket, DISABLE_VOTING, {
    id: updatedIssue.id,
    status: updatedIssue.status,
  });

  adminBroadcast(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(updatedIssue, true));
  emit(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(updatedIssue, userIsAdmin(user)));
}

async function adminEnableVoting(socket, data) {
  const user = await socket.request.user();
  const issue = data.issue;
  logger.debug('Enabling voting', { issue, user: user.name });

  const updatedIssue = await enableVoting({ id: issue }, user);

  broadcastAndEmit(socket, ENABLE_VOTING, {
    id: updatedIssue.id,
    status: updatedIssue.status,
  });
}

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
      case ADMIN_DISABLE_VOTING: {
        adminDisableVoting(socket, payload);
        break;
      }
      case ADMIN_ENABLE_VOTING: {
        adminEnableVoting(socket, payload);
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
  adminDisableVoting,
  adminEnableVoting,
};
