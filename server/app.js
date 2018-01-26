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


if (process.env.PRODUCTION) {
  // Register dist path for static files in prod
  const staticDir = './dist';
  logger.info(`Serving staticfiles from ${staticDir}`);
  app.use('/assets/', express.static(staticDir));
  app.get('*', (req, res) =>
    res.sendFile('index.html', { root: staticDir }));
}

module.exports = app;
