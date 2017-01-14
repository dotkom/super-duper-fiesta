const express = require('express');
const logger = require('./logging');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const getActiveGenfors = require('./helpers').getActiveGenfors;

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`, (err) => {
    if (err) {
      logger.error('respond with file failed', err);
      res.status(err.status).end();
    }
  });
});

/* Get the current active meeting */
app.get('/genfors', (req, res) => {
  // var meeting = getActiveMeeting()
  res.json({ title: 'Generalforsamlingen 2017', date: new Date(1484395200000) });
});

/* Used to fetch historical questions and their results */
app.get('/questions', (req, res) => {
  res.json([{ title: 'temporary question title' }]);
});

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

  getActiveGenfors((meeting) => {
    if (!meeting) {
      socket.emit('meeting', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
    } else {
      socket.emit('meeting', meeting);
    }
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
