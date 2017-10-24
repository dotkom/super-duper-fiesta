const emit = require('../../utils').emit;
const logger = require('../../logging');

const { getActiveGenfors } = require('../../models/meeting');
const { toggleRegistrationStatus } = require('../../managers/meeting');

const {
  TOGGLE_REGISTRATION_STATE,
  TOGGLED_REGISTRATION_STATE } = require('../../../common/actionTypes/meeting');

const toggleRegistration = async (socket, data) => {
  logger.debug('Toggling meeting registration status', data);
  const genfors = await getActiveGenfors();
  const updatedMeeting = await toggleRegistrationStatus(genfors,
    data.registrationOpen);
  emit(socket, TOGGLED_REGISTRATION_STATE, updatedMeeting);
};

const listener = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case TOGGLE_REGISTRATION_STATE: {
        toggleRegistration(socket, data);
        break;
      }
      default:
        break;
    }
  });
};

module.exports = {
  listener,
  toggleRegistration,
};
