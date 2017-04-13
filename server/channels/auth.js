const { emit } = require('../utils');
const { validatePin } = require('../models/meeting');
const { addAnonymousUser } = require('../models/user');
const logger = require('../logging');


module.exports = (socket) => {
  async function action(data) {
    switch (data.type) {
      case 'server/AUTH_REGISTER': {
        const { pin, passwordHash } = data;
        const username = socket.request.user.onlinewebId;
        if (!await validatePin(pin)) {
          logger.silly('User failed pin code', { username, pin });
          emit(socket, 'AUTH_ERROR', { error: 'Feil pinkode' });
          break;
        }
        try {
          await addAnonymousUser(username, passwordHash);
        } catch (err) {
          logger.debug('Failed to register user', { username, err });
          emit(socket, 'AUTH_ERROR', { error: err.message });
          break;
        }
        logger.silly('Successfully registered', { username });
        emit(socket, 'AUTH_REGISTERED', {});
        break;
      }
      default:
        break;
    }
  }
  socket.on('action', action);
};
