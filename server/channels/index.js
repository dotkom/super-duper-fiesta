const socketio = require('socket.io');

const connection = require('./connection');
const issue = require('./issue');

module.exports.listen = (server) => {
  const io = socketio(server);
  io.on('connection', (socket) => {
    connection(socket);
    issue(socket);
  });
};
