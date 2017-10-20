const { emit } = require('../../utils');
const { addGenfors } = require('../../managers/meeting');
const { setUserPermissions } = require('../../managers/user');
const logger = require('../../logging');

const {
  ADMIN_CREATE_GENFORS,
  ADMIN_LOGIN,
  AUTH_SIGNED_IN } = require('../../../common/actionTypes/auth');
const { ERROR } = require('../../../common/actionTypes/error');
const permissionLevel = require('../../../common/auth/permissions');


function verifyAdminPassword(password) {
  return process.env.SDF_GENFORS_ADMIN_PASSWORD !== undefined &&
          process.env.SDF_GENFORS_ADMIN_PASSWORD.length > 0 &&
          process.env.SDF_GENFORS_ADMIN_PASSWORD === password;
}

const adminLogin = async (socket, data) => {
  const { password } = data;
  if (verifyAdminPassword(password)) {
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
    emit(socket, ERROR, { error: 'Ugyldig administratorpassord.' });
  }
};

const createGenfors = async (socket, data) => {
  const { password, title, date } = data;
  if (verifyAdminPassword(password)) {
    await addGenfors(title, date);
    logger.info('Created genfors by administrative request.', { title });
  } else {
    logger.warn('Someone tried to authenticate as administrator.', { title });
    emit(socket, ERROR, { error: 'Ugyldig administratorpassord.' });
  }
};

const listener = (socket) => {
  async function action(data) {
    switch (data.type) {
      case ADMIN_CREATE_GENFORS: {
        createGenfors(socket, data);
        break;
      }
      case ADMIN_LOGIN: {
        adminLogin(socket, data);
        break;
      }
      default:
        break;
    }
  }
  socket.on('action', action);
};

module.exports = {
  adminLogin,
  createGenfors,
  listener,
};
