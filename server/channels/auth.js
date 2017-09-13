const { emit } = require('../utils');
const { getActiveGenfors, validatePin } = require('../models/meeting');
const { addAnonymousUser, setUserPermissions, validatePasswordHash } = require('../models/user');
const logger = require('../logging');

const {
  ADMIN_LOGIN,
  AUTH_REGISTER,
  AUTH_REGISTERED,
  AUTH_SIGNED_IN } = require('../../common/actionTypes/auth');
const permissionLevel = require('../../common/auth/permissions');

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
