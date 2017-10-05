const cookieParser = require('cookie-parser');
const logger = require('../logging');
const socketio = require('socket.io');
const cookieParserIO = require('socket.io-cookie');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passportSocketIo = require('passport.socketio');

const auth = require('./auth');
const permissions = require('../../common/auth/permissions');
const connection = require('./connection');
const issue = require('./issue');
const meeting = require('./admin/meeting');
const userlist = require('./admin/user/userlist');
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

const applyMiddlewares = (io, mongooseConnection) => {
  io.use(passportSocketIo.authorize({
    cookieParser,
    key: 'connect.sid',
    secret: 'super secret',
    store: new MongoStore({ mongooseConnection }),
    success: authorizeSuccess,
    fail: authorizeFailure,
  }));
  io.use(cookieParserIO);
};

const listen = (server, mongooseConnection) => {
  const io = socketio(server);
  applyMiddlewares(io, mongooseConnection);
  io.on('connection', (socket) => {
    connection(socket);
    auth(socket);
    voteListener(socket);

    // Admin
    if (socket.request.user.permissions >= permissions.IS_MANAGER) {
      const user = socket.request.user;
      logger.debug(`${user.name} ('${user.onlinewebId}') has manager status, ` +
        'authorized for admin sockets.');
      issue(socket);
      userlist(socket);
      toggleCanVoteListener(socket);
      meeting(socket);
    }
  });
};

module.exports = {
  applyMiddlewares,
  listen,
};
