const { adminBroadcastAndEmit, broadcastAndEmit, emitError } = require('../../../utils');
const logger = require('../../../logging');

const { getActiveGenfors } = require('../../../models/meeting.accessors');
const { getUserById, updateUserById } = require('../../../models/user.accessors');
const { canEdit } = require('../../../managers/meeting');
const { publicUser, setUserPermissions } = require('../../../managers/user');
const { CAN_VOTE, IS_MANAGER } = require('../../../../common/auth/permissions');

const {
  ADD_USER,
  ADMIN_TOGGLE_CAN_VOTE: TOGGLE_CAN_VOTE,
  TOGGLE_CAN_VOTE: TOGGLED_CAN_VOTE,
  ADMIN_SET_PERMISSIONS,
 } = require('../../../../common/actionTypes/users');

const toggleCanVote = async (socket, data) => {
  const adminUser = await socket.request.user();
  const userId = data.id;
  const canVote = data.canVote;
  const user = await getUserById(userId);
  if (user.permissions < CAN_VOTE) {
    logger.info('Tried to give vote rights to non-member', {
      adminUser: adminUser.name,
      userId,
      canVote,
    });
    emitError(socket, new Error('Brukeren har ikke stemmerett og har derfor ikke lov til å stemme.'));
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
      id: updatedUser.id,
      canVote: updatedUser.canVote,
    });
  } catch (err) {
    logger.error('Something went wrong while updating CAN_VOTE for user', err);
    emitError(socket, new Error('Noe gikk galt under oppdatering av stemmeberettiget'));
  }
};

async function adminSetPermissions(socket, data) {
  const adminUser = await socket.request.user();
  const { permissions, id: userId } = data;

  try {
    if (await !canEdit(IS_MANAGER, adminUser, (await getActiveGenfors()).id)) {
      emitError(socket, new Error('Du har ikke rettigheter til å oppdatere andres rettigheter'));
      return;
    }
    const updatedUser = await setUserPermissions(userId, permissions);
    adminBroadcastAndEmit(socket, ADD_USER, publicUser(updatedUser, true));
  } catch (err) {
    logger.error('Setting user permissions failed', { err });
    emitError(socket, new Error('Noe gikk galt under oppdatering av brukerens rettigheter'));
  }

  toggleCanVote(socket, { id: userId, canVote: data.canVote });
}

const listener = (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case TOGGLE_CAN_VOTE: {
        toggleCanVote(socket, data);
        break;
      }
      case ADMIN_SET_PERMISSIONS: {
        adminSetPermissions(socket, data);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  adminSetPermissions,
  toggleCanVote,
};
