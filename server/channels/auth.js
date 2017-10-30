const { adminBroadcast, broadcastAndEmit, emit, emitError } = require('../utils');
const { getActiveGenfors } = require('../models/meeting');
const { validatePin } = require('../managers/meeting');
const { addAnonymousUser } = require('../managers/user');
const { validatePasswordHash, publicUser } = require('../managers/user');
const { getUserByUsername } = require('../models/user');
const logger = require('../logging');

const { AUTH_REGISTER, AUTH_REGISTERED } = require('../../common/actionTypes/auth');
const { ADD_USER } = require('../../common/actionTypes/users');

const register = async (socket, data) => {
  const { pin, passwordHash } = data;
  const user = await socket.request.user();
  const username = user.onlinewebId;
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
  const { completedRegistration } = user;
  if (completedRegistration) {
    let validPasswordHash = false;
    try {
      validPasswordHash = await validatePasswordHash(user, passwordHash);
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
  const registeredUser = await getUserByUsername(username);
  broadcastAndEmit(socket, ADD_USER, publicUser(registeredUser));
  adminBroadcast(socket, ADD_USER, publicUser(registeredUser, true));
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
