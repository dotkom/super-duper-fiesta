var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/index.html', function(err) {
				if (err) {
					console.error("respond with file failed", err)
					res.status(err.status).end()
				}
		})
})

app.get('/questions', function(req, res) {
	res.json([ { title: 'temporary question title' } ])
})

io.on('connection', function (socket) {
  socket.broadcast.emit('news', { hello: 'world', message: "Hello world!" });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(3000, function () {
	  console.log('Example app listening on port 3000!')
})
