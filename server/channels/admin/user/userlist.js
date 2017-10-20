const { emit, emitError } = require('../../../utils');
const logger = require('../../../logging');

const { getActiveGenfors } = require('../../../models/meeting');
const { getUsers } = require('../../../models/user');

const { REQUEST_USER_LIST, RECEIVE_USER_LIST: USER_LIST } = require('../../../../common/actionTypes/users');

const requestUserList = async (socket) => {
  await getActiveGenfors().then((genfors) => {
    getUsers(genfors)
    .then((users) => {
      logger.debug('Retrieved all registered users.', { num_users: users.length });
      emit(socket, USER_LIST, users);
    }).catch((err) => {
      logger.error('Retrieving users failed.', err);
      emitError(socket, new Error('Could not fetch user list.'));
    });
  }).catch((err) => {
    logger.error('Retrieving current active genfors failed', err);
  });
};

const listener = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case REQUEST_USER_LIST:
        requestUserList(socket);
        break;
      default:
        break;
    }
  });
};

module.exports = {
  listener, requestUserList,
};
