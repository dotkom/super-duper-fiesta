const express = require('express');
const logger = require('./logging');

const app = express();

const server = require('http').Server(app);
const routes = require('./routes');

require('./channels').listen(server);

app.use('/public', express.static('public'));
app.use('/', routes);

server.listen(3000, () => {
  logger.info('Example app listening on port 3000!');
});
