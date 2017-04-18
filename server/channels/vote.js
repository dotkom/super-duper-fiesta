const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addVote = require('../models/vote').addVote;
const generatePublicVote = require('../models/vote').generatePublicVote;
const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getAnonymousUser = require('../models/user').getAnonymousUser;

module.exports = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case 'server/SUBMIT_REGULAR_VOTE':
        logger.debug('Received vote', { userFullName: socket.request.user.name });
        addVote(data.issue, socket.request.user, data.alternative)
        .then(async (vote) => {
          logger.debug('Stored new vote. Broadcasting ...');
          emit(socket, 'ADD_VOTE', await generatePublicVote(data.issue, vote));
          broadcast(socket, 'ADD_VOTE', await generatePublicVote(data.issue, vote));
        }).catch((err) => {
          logger.error('Storing new vote failed.', err);
          emit(socket, 'ADD_VOTE', {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      case 'server/SUBMIT_ANONYMOUS_VOTE': {
        logger.debug('Received anonymous vote');
        const genfors = await getActiveGenfors();
        const anonymousUser = await getAnonymousUser(data.passwordHash,
          socket.request.user.onlinewebId, genfors);
        addVote(data.issue, socket.request.user, data.alternative, anonymousUser)
        .then(async (vote) => {
          logger.debug('Stored new anonymous vote. Broadcasting ...');
          emit(socket, 'ADD_VOTE', await generatePublicVote(data.issue, vote));
          broadcast(socket, 'ADD_VOTE', await generatePublicVote(data.issue, vote));
        }).catch((err) => {
          logger.error('Storing new anonymous vote failed.', err);
          emit(socket, 'ADD_VOTE', {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      }
      default:
        break;
    }
  });
};
