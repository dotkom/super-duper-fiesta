const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('./logging');
const Raven = require('raven');

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
  // Register dist path for static files in prod
  const staticDir = './dist';
  logger.info(`Serving staticfiles from ${staticDir}`);
  app.use('/dist', express.static(staticDir));
} else {
  logger.info('Starting chokidar, watching server for changes');
  require('./chokidar.conf.js'); // eslint-disable-line global-require
}

Raven
.config(process.env.SDF_SENTRY_DSN_BACKEND, {
  captureUnhandledRejections: true,
  tags: {
    app: 'backend',
  },
})
.install();

const HOST = process.env.SDF_HOST || 'localhost';
const PORT = process.env.SDF_PORT || 3000;
const SCHEME = process.env.SDF_SCHEME || 'http';

server.listen(PORT, HOST, () => {
  logger.info(`Running super-duper-fiesta on ${SCHEME}://${HOST}:${PORT}`);
});
