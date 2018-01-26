const http = require('http');
const appConfig = require('./app');
const channels = require('./channels/index');
const logger = require('./logging');
const Raven = require('raven');
const mongodbConfig = require('./models/essentials');

(async () => {
  const app = await appConfig();
  const mongooseConnection = mongodbConfig(app);

  // Set up socket.io
  const server = http.Server(app);
  channels.listen(server, mongooseConnection);

  Raven
  .config(process.env.SDF_SENTRY_DSN_BACKEND, {
    captureUnhandledRejections: true,
    tags: {
      app: 'backend',
    },
  })
  .install();

  const HOST = process.env.SDF_BACKEND_HOST || 'localhost';
  const PORT = process.env.SDF_BACKEND_PORT || 3000;
  const SCHEME = process.env.SDF_SCHEME || 'http';

  server.listen(PORT, HOST, () => {
    logger.info(`Running super-duper-fiesta on ${SCHEME}://${HOST}:${PORT}`);
  });
})();
