const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const db = require('./scheme.js');

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/index.html', function(err) {
				if (err) {
					console.error("respond with file failed", err)
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
    console.log(data);
  });
	// End dummy code

	// var meeting = getActiveMeeting()
	// if (!meeting) { socket.emit('meeting', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' }) }
	socket.emit('meeting', { title: 'Some meeting' })
});

server.listen(3000, function () {
	  console.log('Example app listening on port 3000!')
})
