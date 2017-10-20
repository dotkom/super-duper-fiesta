const { emit, emitError } = require('../utils');
const { getActiveGenfors } = require('../models/meeting');
const { validatePin } = require('../managers/meeting');
const { addAnonymousUser } = require('../managers/user');
const { validatePasswordHash } = require('../managers/user');
const logger = require('../logging');

const { AUTH_REGISTER, AUTH_REGISTERED } = require('../../common/actionTypes/auth');

const register = async (socket, data) => {
  const { pin, passwordHash } = data;
  const username = socket.request.user.onlinewebId;
  const genfors = await getActiveGenfors();
  if (!genfors.registrationOpen) {
    emitError(socket, new Error('Registreringen er ikke åpen.'));
    return;
  }
  if (!await validatePin(pin)) {
    logger.silly('User failed pin code', { username, pin });
    emitError(socket, new Error('Feil pinkode'));
    return;
  }
  const { completedRegistration } = socket.request.user;
  if (completedRegistration) {
    let validPasswordHash = false;
    try {
      validPasswordHash = await validatePasswordHash(socket.request.user, passwordHash);
    } catch (err) {
      logger.debug('Failed to validate user', { username, err });
      emitError(socket, new Error('Validering av personlig kode feilet'));
      return;
    }
    if (validPasswordHash) {
      emit(socket, AUTH_REGISTERED, { registered: true });
    } else {
      emitError(socket, new Error('Feil personlig kode'));
    }
    return;
  }
  try {
    await addAnonymousUser(username, passwordHash);
  } catch (err) {
    logger.debug('Failed to register user', { username, err });
    emitError(socket, new Error('Noe gikk galt under registreringen. Prøv igjen'));
    return;
  }
  logger.silly('Successfully registered', { username });
  emit(socket, AUTH_REGISTERED, { registered: true });
};

const listener = (socket) => {
  async function action(data) {
    switch (data.type) {
      case AUTH_REGISTER: {
        register(socket, data);
        break;
      }
      default:
        break;
    }
  }
  socket.on('action', action);
};

module.exports = {
  listener,
  register,
};
