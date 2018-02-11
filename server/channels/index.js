const cookieParser = require('cookie-parser');
const logger = require('../logging');
const socketio = require('socket.io');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passportSocketIo = require('passport.socketio');

const db = require('../models/postgresql');

const { userIsAdmin } = require('../../common/auth/permissions');
const connection = require('./connection');
const { listener: authListener } = require('./auth');
const { listener: issueListener } = require('./issue');
const { listener: adminAuthListener } = require('./admin/authAdmin');
const { listener: meetingListener } = require('./admin/meeting');
const { listener: toggleCanVoteListener } = require('./admin/user/toggle_vote');
const { listener: voteListener } = require('./vote');

const authorizeSuccess = (data, accept) => {
  logger.silly('Authorized socket connection');
  accept();
};

const authorizeFailure = (data, message, error, accept) => {
  logger.silly(`Authorization failed for socket connection: ${message}`);
  if (error) {
    logger.error(`Error occured: ${message}`, error);
    accept(new Error(message));
  }
};

const applyMiddlewares = (io) => {
  io.use(passportSocketIo.authorize({
    cookieParser,
    key: 'connect.sid',
    secret: 'super secret',
    store: new SequelizeStore({ db: db.sequelize }),
    success: authorizeSuccess,
    fail: authorizeFailure,
  }));
};

const listen = (server) => {
  const io = socketio(server);
  io.on('connection', async (socket) => {
    connection(socket);
    authListener(socket);
    voteListener(socket);

    // Listeners used to login as admin
    adminAuthListener(socket);

    const user = await socket.request.user();
    // Admin
    if (userIsAdmin(user)) {
      socket.join('admin');
      logger.debug(`${user.name} ('${user.onlinewebId}') has manager status, ` +
        'authorized for admin sockets.');
      issueListener(socket);
      toggleCanVoteListener(socket);
      meetingListener(socket);
    }
  });
  return io;
};

module.exports = {
  applyMiddlewares,
  listen,
};
