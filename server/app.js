const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('./logging');

// Initialize express
const app = express();

// Set up database and get connection
const mongooseConnection = require('./models/essentials')(app);

// Set up session store
app.use(session({
  secret: 'super secret',
  store: new MongoStore({ mongooseConnection }),
  resave: true,
  saveUninitialized: true,
}));

// Set up auth
const auth = require('./auth');

auth(app);

// Set up socket.io
const server = require('http').Server(app);
require('./channels/index').listen(server, mongooseConnection);

if (process.env.PRODUCTION) {
  const staticDir = './dist';
  logger.info(`Serving staticfiles from ${staticDir}`);
  app.use('/dist', express.static(staticDir));
} else {
  const addWebpackMiddlewares = require('./webpack-dev-middleware'); // eslint-disable-line global-require
  logger.info('Starting webpack hot-reloading client');
  addWebpackMiddlewares(app);

  logger.info('Starting chokidar, watching server for changes');
  require('./chokidar.conf.js'); // eslint-disable-line global-require
}

app.use((req, res, next) => {
  require('./routes/index')(req, res, next); // eslint-disable-line global-require
});

const HOST = process.env.SDF_HOST || 'localhost';
const PORT = process.env.SDF_PORT || 3000;

server.listen(PORT, HOST, () => {
  logger.info('Running super-duper-fiesta on %s:%s', HOST, PORT);
});
