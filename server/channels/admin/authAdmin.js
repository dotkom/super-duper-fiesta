const { broadcastAndEmit, emit, emitError } = require('../../utils');
const { addGenfors, publicMeeting } = require('../../managers/meeting');
const { setUserPermissions } = require('../../managers/user');
const logger = require('../../logging');

const {
  ADMIN_CREATE_GENFORS,
  ADMIN_LOGIN,
  ADMIN_SIGNED_IN } = require('../../../common/actionTypes/auth');
const { OPEN_MEETING } = require('../../../common/actionTypes/meeting');
const permissionLevel = require('../../../common/auth/permissions');


function verifyAdminPassword(password) {
  return process.env.SDF_GENFORS_ADMIN_PASSWORD !== undefined &&
          process.env.SDF_GENFORS_ADMIN_PASSWORD.length > 0 &&
          process.env.SDF_GENFORS_ADMIN_PASSWORD === password;
}

const adminLogin = async (socket, data) => {
  const { password } = data;
  const user = await socket.request.user();
  if (verifyAdminPassword(password)) {
    logger.info(`'${user.name}' authenticated as admin using admin password.`);
    await setUserPermissions(user._id,
      permissionLevel.IS_MANAGER);
    emit(socket, ADMIN_SIGNED_IN);
  } else {
    logger.info(`'${user.name}' tried to authenticate as admin using admin password.`);
    emitError(socket, new Error('Ugyldig administratorpassord.'));
  }
};

const createGenfors = async (socket, data) => {
  const { password, title, date } = data;
  if (verifyAdminPassword(password)) {
    const genfors = await addGenfors(title, date);
    logger.info('Created genfors by administrative request.', { title });
    broadcastAndEmit(socket, OPEN_MEETING, publicMeeting(genfors));
  } else {
    logger.warn('Someone tried to authenticate as administrator.', { title });
    emitError(socket, new Error('Ugyldig administratorpassord.'));
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
