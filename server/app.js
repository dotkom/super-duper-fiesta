const express = require('express');
const logger = require('./logging');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const routes = require('./routes');

const getActiveGenfors = require('./helpers').getActiveGenfors;

app.use('/public', express.static('public'));
app.use('/', routes);

io.on('connection', (socket) => {
  // Some dummy code
  // Send an event to whoever connected
  socket.emit('private', { message: 'Hey ;)' });
  // Broadcast an event to all connections
  socket.broadcast.emit('public', { hello: 'world', message: 'Hello world!' });
  // Do something when we receive this kind of event
  socket.on('my other event', (data) => {
    logger.debug(data);
  });
  // End dummy code

  getActiveGenfors().then((meeting) => {
    if (!meeting) {
      socket.emit('meeting', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
    } else {
      socket.emit('meeting', meeting);
    }
  }).catch((err) => {
    logger.err('Something went wrong.', { err });
    socket.emit('error', 'Noe gikk galt. Vennligst prøve igjen.');
  });
});

io.on('issue', (socket) => {
  if (socket.data.status === true) {
    // create issue
  }
  if (socket.data.status === false) {
    // closeIssue(socket.data)
  }
});

server.listen(3000, () => {
  logger.info('Example app listening on port 3000!');
});
