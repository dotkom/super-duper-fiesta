const { emit } = require('../utils');
const { getActiveGenfors } = require('../models/meeting');
const { validatePin } = require('../managers/meeting');
const { addAnonymousUser } = require('../managers/user');
const { setUserPermissions } = require('../managers/user');
const { validatePasswordHash } = require('../managers/user');
const logger = require('../logging');

const {
  ADMIN_LOGIN,
  AUTH_REGISTER,
  AUTH_REGISTERED,
  AUTH_SIGNED_IN } = require('../../common/actionTypes/auth');
const permissionLevel = require('../../common/auth/permissions');

const register = async (socket, data) => {
  const { pin, passwordHash } = data;
  const username = socket.request.user.onlinewebId;
  const genfors = await getActiveGenfors();
  if (!genfors.registrationOpen) {
    emit(socket, 'AUTH_ERROR', { error: 'Registreringen er ikke åpen.' });
    return;
  }
  if (!await validatePin(pin)) {
    logger.silly('User failed pin code', { username, pin });
    emit(socket, 'AUTH_ERROR', { error: 'Feil pinkode' });
    return;
  }
  const { completedRegistration } = socket.request.user;
  if (completedRegistration) {
    let validPasswordHash = false;
    try {
      validPasswordHash = await validatePasswordHash(socket.request.user, passwordHash);
    } catch (err) {
      logger.debug('Failed to validate user', { username, err });
      emit(socket, 'AUTH_ERROR', { error: 'Validering av personlig kode feilet' });
      return;
    }
    if (validPasswordHash) {
      emit(socket, AUTH_REGISTERED, { registered: true });
    } else {
      emit(socket, 'AUTH_ERROR', { error: 'Feil personlig kode' });
    }
    return;
  }
  try {
    await addAnonymousUser(username, passwordHash);
  } catch (err) {
    logger.debug('Failed to register user', { username, err });
    emit(socket, 'AUTH_ERROR', { error: 'Noe gikk galt under registreringen. Prøv igjen' });
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
      case ADMIN_LOGIN: {
        const { password } = data;
        if (process.env.SDF_GENFORS_ADMIN_PASSWORD !== undefined &&
            process.env.SDF_GENFORS_ADMIN_PASSWORD.length > 0 &&
            password === process.env.SDF_GENFORS_ADMIN_PASSWORD) {
          logger.info(`'${socket.request.user.name}' authenticated as admin using admin password.`);
          // eslint-disable-next-line no-underscore-dangle
          const updatedUser = await setUserPermissions(socket.request.user._id,
            permissionLevel.IS_MANAGER);
          emit(socket, AUTH_SIGNED_IN, {
            username: updatedUser.username,
            full_name: updatedUser.name,
            logged_in: updatedUser.logged_in,
            id: updatedUser._id, // eslint-disable-line no-underscore-dangle
            permissions: updatedUser.permissions,
          });
        } else {
          logger.info(`'${socket.request.user.name}' tried to authenticate as admin using admin password.`);
          emit(socket, 'AUTH_ERROR', { error: 'Ugyldig administratorpassord.' });
        }
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
