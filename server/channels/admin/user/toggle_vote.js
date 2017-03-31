const broadcast = require('../../../utils').broadcast;
const emit = require('../../../utils').emit;
const logger = require('../../../logging');

const updateUserById = require('../../../models/user').updateUserById;

module.exports = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case 'server/TOGGLE_CAN_VOTE': {
        const adminUser = socket.request.user;
        const userId = data.id;
        const canVote = data.canVote;
        logger.debug('Toggling can vote status', {
          adminUser: adminUser.name,
          userId,
          currentCanVote: canVote,
        });
        updateUserById(userId, { canVote: !canVote })
        .then((user) => {
          logger.debug('Updated canVote for user.', {
            adminUser: adminUser.name,
            userId,
            userName: user.onlinewebId,
            userFullName: user.name,
            currentCanVote: user.canVote,
          });
          emit(socket, 'TOGGLE_CAN_VOTE', user);
          broadcast(socket, 'TOGGLE_CAN_VOTE', user);
        }).catch((err) => {
          logger.error('Retrieving user failed.', err);
          emit(socket, 'TOGGLE_CAN_VOTE', [], {
            error: 'Could not fetch user list.',
          });
        });
        break;
      }
      default:
        break;
    }
  });
};
