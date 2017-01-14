const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./scheme.js');
const logger = require('./logging');

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/index.html', function(err) {
				if (err) {
					logger.error("respond with file failed", err)
					res.status(err.status).end()
				}
		})
})

/* Get the current active meeting */
app.get('/genfors', function(req, res) {
	// var meeting = getActiveMeeting()
	// if (!meeting) { res.json({ error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' }) }
	res.json({ title: 'Generalforsamlingen 2017', date: new Date(1484395200000) })
})

/* Used to fetch historical questions and their results */
app.get('/questions', function(req, res) {
	res.json([ { title: 'temporary question title' } ])
})

io.on('connection', function (socket) {
	// Some dummy code
	// Send an event to whoever connected
	socket.emit('private', { message: 'Hey ;)' })
	// Broadcast an event to all connections
  socket.broadcast.emit('public', { hello: 'world', message: "Hello world!" });
	// Do something when we receive this kind of event
  socket.on('my other event', function (data) {
    logger.debug(data);
  });
	// End dummy code

	db.getActiveGenfors(function(data) {
		logger.debug('genfors data', data)
		if (!data) { socket.emit('meeting', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' }) }
		socket.emit('meeting', data)
	})
});

io.on('issue', function(socket) {
	if (socket.data.status === true) {
		// create issue
	}
	if (socket.data.status === false) {
		// closeIssue(socket.data)
	}
})

server.listen(3000, function () {
	  logger.info('Example app listening on port 3000!')
})
