const { broadcastAndEmit, emit, emitError } = require('../utils');
const logger = require('../logging');

const { addVote, generatePublicVote } = require('../managers/vote');
const { getActiveGenfors } = require('../models/meeting');
const { getAnonymousUser } = require('../models/user');
const { isRegistered } = require('../managers/user');

const {
  RECEIVE_VOTE: SEND_VOTE,
  SUBMIT_ANONYMOUS_VOTE,
  SUBMIT_REGULAR_VOTE,
  USER_VOTE,
} = require('../../common/actionTypes/voting');

const checkRegistered = async (socket) => {
  const { user } = socket.request;
  const { passwordHash } = socket.request.headers.cookie;
  const registered = await isRegistered(user, passwordHash);
  if (!registered) {
    emitError(socket, new Error('Du er ikke registert'));
    return false;
  }
  return true;
};

const submitRegularVote = async (socket, data) => {
  logger.debug('Received vote', { userFullName: socket.request.user.name });
  if (!await checkRegistered(socket)) {
    return;
  }
  try {
    const vote = await addVote(
      data.issue, socket.request.user,
      // eslint-disable-next-line no-underscore-dangle
      data.alternative, socket.request.user._id,
    );
    logger.debug('Stored new vote. Broadcasting ...');
    broadcastAndEmit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
    emit(socket, USER_VOTE, {
      alternativeId: vote.alternative,
      issueId: vote.question,
    });
  } catch (err) {
    logger.error('Storing new vote failed.', err);
    emitError(socket, err);
  }
};

const submitAnonymousVote = async (socket, data) => {
  logger.debug('Received anonymous vote');
  if (!await checkRegistered(socket)) {
    return;
  }
  const genfors = await getActiveGenfors();
  const anonymousUser = await getAnonymousUser(data.passwordHash,
  socket.request.user.onlinewebId, genfors);
  try {
    const vote = await addVote(data.issue, socket.request.user,
      // eslint-disable-next-line no-underscore-dangle
      data.alternative, anonymousUser._id);
    logger.debug('Stored new anonymous vote. Broadcasting ...');
    broadcastAndEmit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
    emit(socket, USER_VOTE, {
      alternativeId: vote.alternative,
      issueId: vote.question,
    });
  } catch (err) {
    logger.error('Storing new anonymous vote failed.', err);
    emitError(socket, err);
  }
};

const listener = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case SUBMIT_REGULAR_VOTE:
        submitRegularVote(socket, data);
        break;
      case SUBMIT_ANONYMOUS_VOTE: {
        submitAnonymousVote(socket, data);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  submitAnonymousVote,
  submitRegularVote,
};
