const express = require('express');
const logger = require('./logging');

const app = express();

const server = require('http').Server(app);
const routes = require('./routes/index');

require('./channels/index').listen(server);

require('./models/essentials');

if (process.env.PRODUCTION) {
  const staticDir = './dist';
  logger.info(`Serving staticfiles from ${staticDir}`);
  app.use('/dist', express.static(staticDir));
} else {
  const webpackDevMiddleware = require('./webpack-dev-middleware'); // eslint-disable-line global-require
  logger.info('Starting webpack hot-reloading client');
  app.use(webpackDevMiddleware);
}

app.use('/', routes);

const HOST = process.env.SDF_HOST || 'localhost';
const PORT = process.env.SDF_PORT || 3000;

server.listen(PORT, HOST, () => {
  logger.info('Running super-duper-fiesta on %s:%s', HOST, PORT);
});
