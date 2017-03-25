const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passportSocketIo = require('passport.socketio');

const connection = require('./connection');
const issue = require('./issue');

const authorizeSuccess = (data, accept) => {
  console.log('Authorized socket connection');
  accept();
};

const authorizeFailure = (data, message, error, accept) => {
  console.log(`Authorization failed for socket connection: ${message}`);
  if (error) {
    console.log('Error occured!');
    accept(new Error(message));
  }
};

module.exports.listen = (server, mongooseConnection) => {
  const io = socketio(server);
  io.use(passportSocketIo.authorize({
    cookieParser,
    key: 'connect.sid',
    secret: 'super secret',
    store: new MongoStore({ mongooseConnection }),
    success: authorizeSuccess,
    fail: authorizeFailure,
  }));
  io.on('connection', (socket) => {
    connection(socket);
    issue(socket);
  });
};
