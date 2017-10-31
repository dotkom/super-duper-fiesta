const { broadcastAndEmit, emitError, adminBroadcast } = require('../../utils');
const logger = require('../../logging');

const { getActiveGenfors } = require('../../models/meeting');
const { endGenfors, toggleRegistrationStatus, publicMeeting } = require('../../managers/meeting');

const {
  ADMIN_END_MEETING,
  END_MEETING,
  TOGGLE_REGISTRATION_STATE,
  TOGGLED_REGISTRATION_STATE } = require('../../../common/actionTypes/meeting');


async function endGAM(socket) {
  const genfors = await getActiveGenfors();
  logger.info('Ending meeting', { genfors: genfors.title });
  await endGenfors(genfors, await socket.request.user());

  broadcastAndEmit(socket, END_MEETING);
}

const toggleRegistration = async (socket, data) => {
  logger.debug('Toggling meeting registration status', data);
  const genfors = await getActiveGenfors();
  try {
    const updatedMeeting = await toggleRegistrationStatus({ _id: genfors._id },
    data.registrationOpen);
    broadcastAndEmit(socket, TOGGLED_REGISTRATION_STATE, publicMeeting(updatedMeeting));
    adminBroadcast(socket, TOGGLED_REGISTRATION_STATE, publicMeeting(updatedMeeting, true));
  } catch (err) {
    logger.warn('Toggling registration failed for meeting', { genfors: genfors.title, err });
    emitError(socket, new Error('Noe gikk galt under oppdatering av registreringsstatus.'));
  }
};

const listener = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case TOGGLE_REGISTRATION_STATE: {
        toggleRegistration(socket, data);
        break;
      }
      case ADMIN_END_MEETING: {
        endGAM(socket);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  endGAM,
  toggleRegistration,
};
