const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addVote = require('../models/vote').addVote;
const generatePublicVote = require('../models/vote').generatePublicVote;
const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const { getAnonymousUser, isRegistered } = require('../models/user');

const {
  RECEIVE_VOTE: SEND_VOTE,
  SUBMIT_ANONYMOUS_VOTE,
  SUBMIT_REGULAR_VOTE,
} = require('../../common/actionTypes/voting');

const checkRegistered = async (socket) => {
  const { user } = socket.request;
  const { passwordHash } = socket.request.headers.cookie;
  const registered = await isRegistered(user, passwordHash);
  if (!registered) {
    emit(socket, SEND_VOTE, {}, {
      error: 'Du er ikke registert',
    });
    return false;
  }
  return true;
};

module.exports = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case SUBMIT_REGULAR_VOTE:
        logger.debug('Received vote', { userFullName: socket.request.user.name });
        if (!await checkRegistered(socket)) {
          break;
        }
        // eslint-disable-next-line no-underscore-dangle
        addVote(data.issue, socket.request.user, data.alternative, socket.request.user._id)
        .then(async (vote) => {
          logger.debug('Stored new vote. Broadcasting ...');
          emit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          broadcast(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
        }).catch((err) => {
          logger.error('Storing new vote failed.', err);
          emit(socket, SEND_VOTE, {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      case SUBMIT_ANONYMOUS_VOTE: {
        logger.debug('Received anonymous vote');
        if (!await checkRegistered(socket)) {
          break;
        }
        const genfors = await getActiveGenfors();
        const anonymousUser = await getAnonymousUser(data.passwordHash,
          socket.request.user.onlinewebId, genfors);
        // eslint-disable-next-line no-underscore-dangle
        addVote(data.issue, socket.request.user, data.alternative, anonymousUser._id)
        .then(async (vote) => {
          logger.debug('Stored new anonymous vote. Broadcasting ...');
          emit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          broadcast(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
        }).catch((err) => {
          logger.error('Storing new anonymous vote failed.', err);
          emit(socket, SEND_VOTE, {}, {
            error: err.message,
          });
        });
        break;
      }
      default:
        break;
    }
  });
};
