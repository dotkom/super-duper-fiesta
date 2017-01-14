const express = require('express');
const logger = require('./logging');

const app = express();

const server = require('http').Server(app);
const routes = require('./routes/index');

require('./channels/index').listen(server);

app.use('/public', express.static('public'));
app.use('/', routes);

const HOST = process.env.SDF_HOST || 'localhost';
const PORT = process.env.SDF_PORT || 3000;

server.listen(PORT, HOST, () => {
  logger.info('Webserver running on %s:%s', HOST, PORT);
});
