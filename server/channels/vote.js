const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addVote = require('../models/vote').addVote;

module.exports = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case 'server/SUBMIT_REGULAR_VOTE':
        logger.debug('Received vote', { userFullName: socket.request.user.name });
        addVote(data.issue, socket.request.user, data.alternative)
        .then((vote) => {
          logger.debug('Stored new vote. Broadcasting ...');
          emit(socket, 'ADD_VOTE', vote);
          broadcast(socket, 'ADD_VOTE', vote);
        }).catch((err) => {
          logger.error('Storing new vote failed.', err);
          emit(socket, 'ADD_VOTE', {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      case 'server/SUBMIT_ANONYMOUS_VOTE':
        logger.debug('Received anonymous vote');
        addVote(data.issue, null, data.alternative, null)
        .then((vote) => {
          logger.debug('Stored new vote. Broadcasting ...');
          emit(socket, 'ADD_VOTE', vote);
          broadcast(socket, 'ADD_VOTE', vote);
        }).catch((err) => {
          logger.error('Storing new vote failed.', err);
          emit(socket, 'ADD_VOTE', {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      default:
        break;
    }
  });
};
