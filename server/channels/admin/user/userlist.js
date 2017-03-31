const emit = require('../../../utils').emit;
const logger = require('../../../logging');

const getActiveGenfors = require('../../../models/meeting').getActiveGenfors;
const getUsers = require('../../../models/user').getUsers;

module.exports = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case 'server/REQUEST_USER_LIST':
        getActiveGenfors().then((genfors) => {
          getUsers(genfors)
          .then((users) => {
            logger.debug('Retrieved all registered users.', { num_users: users.length });
            emit(socket, 'USER_LIST', users);
          }).catch((err) => {
            logger.error('Retrieving users failed.', err);
            emit(socket, 'USER_LIST', [], {
              error: 'Could not fetch user list.',
            });
          });
        }).catch((err) => {
          logger.error('Retrieving current active genfors failed', err);
        });
        break;
      default:
        break;
    }
  });
};
