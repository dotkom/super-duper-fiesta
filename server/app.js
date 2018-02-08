const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const logger = require('./logging');
const auth = require('./auth');
const db = require('./models/postgresql');

// Initialize express
const app = express();

// Set up database and get connection
const store = new SequelizeStore({ db: db.sequelize });

// Set up session store
app.use(session({
  secret: 'super secret',
  store,
  resave: true,
  saveUninitialized: true,
}));

store.sync();

if (process.env.PRODUCTION) {
  // Register dist path for static files in prod
  const staticDir = './dist';
  logger.info(`Serving staticfiles from ${staticDir}`);
  app.use('/assets/', express.static(staticDir));
  app.get('*', (req, res) =>
    res.sendFile('index.html', { root: staticDir }));
}

module.exports = async () => auth(app);
