const { broadcastAndEmit } = require('../../../utils');
const emit = require('../../../utils').emit;
const logger = require('../../../logging');

const { updateUserById } = require('../../../models/user');
const permissionLevels = require('../../../../common/auth/permissions');

const { ADMIN_TOGGLE_CAN_VOTE: TOGGLE_CAN_VOTE, TOGGLE_CAN_VOTE: TOGGLED_CAN_VOTE } =
  require('../../../../common/actionTypes/users');

const toggleCanVote = async (socket, data) => {
  const adminUser = socket.request.user;
  const userId = data.id;
  const canVote = data.canVote;
  logger.debug('Toggling can vote status', {
    adminUser: adminUser.name,
    userId,
    currentCanVote: canVote,
    expectedCanVote: !canVote,
  });
  await updateUserById(userId, { canVote, permissions: permissionLevels.CAN_VOTE }, { new: true })
  .then((user) => {
    logger.debug('Updated canVote for user.', {
      adminUser: adminUser.name,
      userId,
      userName: user.onlinewebId,
      userFullName: user.name,
      canVote: user.canVote,
    });
    broadcastAndEmit(socket, TOGGLED_CAN_VOTE, {
      _id: user._id,
      canVote: user.canVote,
    });
  }).catch((err) => {
    logger.error('Retrieving user failed.', err);
    emit(socket, TOGGLED_CAN_VOTE, [], {
      error: 'Could not fetch user list.',
    });
  });
};

const listener = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case TOGGLE_CAN_VOTE: {
        toggleCanVote(socket, data);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  toggleCanVote,
};
