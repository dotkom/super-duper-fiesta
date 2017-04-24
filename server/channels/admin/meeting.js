const emit = require('../../utils').emit;
const logger = require('../../logging');

const getActiveGenfors = require('../../models/meeting').getActiveGenfors;
const toggleRegistrationStatus = require('../../models/meeting').toggleRegistrationStatus;

const {
  TOGGLE_REGISTRATION_STATE,
  TOGGLED_REGISTRATION_STATE } = require('../../../common/actionTypes/meeting');

module.exports = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case TOGGLE_REGISTRATION_STATE: {
        logger.debug('Toggling meeting registration status', data);
        const genfors = await getActiveGenfors();
        const updatedMeeting = await toggleRegistrationStatus(genfors,
          data.registrationOpen);
        emit(socket, TOGGLED_REGISTRATION_STATE, updatedMeeting);
        break;
      }
      default:
        break;
    }
  });
};
