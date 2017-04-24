const { emit } = require('../utils');
const { getActiveGenfors, validatePin } = require('../models/meeting');
const { addAnonymousUser, validatePasswordHash } = require('../models/user');
const logger = require('../logging');

const { AUTH_REGISTER, AUTH_REGISTERED } = require('../../common/actionTypes/auth');

module.exports = (socket) => {
  async function action(data) {
    switch (data.type) {
      case AUTH_REGISTER: {
        const { pin, passwordHash } = data;
        const username = socket.request.user.onlinewebId;
        const genfors = await getActiveGenfors();
        if (!genfors.registrationOpen) {
          emit(socket, 'AUTH_ERROR', { error: 'Registreringen er ikke åpen.' });
          break;
        }
        if (!await validatePin(pin)) {
          logger.silly('User failed pin code', { username, pin });
          emit(socket, 'AUTH_ERROR', { error: 'Feil pinkode' });
          break;
        }
        const { completedRegistration } = socket.request.user;
        if (completedRegistration) {
          let validPasswordHash = false;
          try {
            validPasswordHash = await validatePasswordHash(socket.request.user, passwordHash);
          } catch (err) {
            logger.debug('Failed to validate user', { username, err });
            emit(socket, 'AUTH_ERROR', { error: 'Validering av personlig kode feilet' });
          }
          if (validPasswordHash) {
            emit(socket, AUTH_REGISTERED, { registered: true });
          } else {
            emit(socket, 'AUTH_ERROR', { error: 'Feil personlig kode' });
          }
          break;
        }
        try {
          await addAnonymousUser(username, passwordHash);
        } catch (err) {
          logger.debug('Failed to register user', { username, err });
          emit(socket, 'AUTH_ERROR', { error: 'Noe gikk galt under registreringen. Prøv igjen' });
          break;
        }
        logger.silly('Successfully registered', { username });
        emit(socket, AUTH_REGISTERED, { registered: true });
        break;
      }
      default:
        break;
    }
  }
  socket.on('action', action);
};
