const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;

const connection = (socket) => {
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
    logger.error('Something went wrong.', { err });
    emit(socket, 'issue', {}, {
      error: 'Noe gikk galt. Vennligst prøv igjen.',
    });
  });
};

module.exports = connection;
