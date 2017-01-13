var express = require('express')
var app = express()

app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/index.html', function(err) {
				if (err) {
					console.error("respond with file failed", err)
					res.status(err.status).end()
				}
		})
})

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!')
})
