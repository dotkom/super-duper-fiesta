const { broadcastAndEmit, emitError } = require('../../../utils');
const logger = require('../../../logging');

const { getUserById, updateUserById } = require('../../../models/user');
const { CAN_VOTE } = require('../../../../common/auth/permissions');

const { ADMIN_TOGGLE_CAN_VOTE: TOGGLE_CAN_VOTE, TOGGLE_CAN_VOTE: TOGGLED_CAN_VOTE } =
  require('../../../../common/actionTypes/users');

const toggleCanVote = async (socket, data) => {
  const adminUser = socket.request.user;
  const userId = data.id;
  const canVote = data.canVote;
  const user = await getUserById(userId);
  if (user.permissions < CAN_VOTE) {
    logger.info('Tried to give vote rights to non-member', {
      adminUser: adminUser.name,
      userId,
      canVote,
    });
    emitError(socket, new Error('Brukeren er ikke medlem og har derfor ikke lov til å stemme'));
    return;
  }
  logger.debug('Toggling can vote status', {
    adminUser: adminUser.name,
    userId,
    currentCanVote: canVote,
    expectedCanVote: !canVote,
  });
  try {
    const updatedUser = await updateUserById(userId, { canVote }, { new: true });
    logger.debug('Updated canVote for user.', {
      adminUser: adminUser.name,
      userId,
      userName: updatedUser.onlinewebId,
      userFullName: updatedUser.name,
      canVote: updatedUser.canVote,
    });
    broadcastAndEmit(socket, TOGGLED_CAN_VOTE, {
      _id: updatedUser._id,
      canVote: updatedUser.canVote,
    });
  } catch (err) {
    logger.error('Retrieving user failed.', err);
    emitError(socket, new Error('Noe gikk galt under oppdatering av stemmeberettiget'));
  }
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
