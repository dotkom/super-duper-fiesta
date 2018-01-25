const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const logger = require('./logging');
const auth = require('./auth');
const db = require('./models/postgresql');

// Initialize express
const app = express();

// Set up session store using database connection
const store = new SequelizeStore({ db: db.sequelize });

const sessionSecret = process.env.SDF_SESSION_STORE_SECRET || 'super secret';

// Set up session store
app.use(session({
  secret: sessionSecret,
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
  app.get(/^(?!\/(log(in|out)|auth))/, (req, res) =>
    res.sendFile('index.html', { root: staticDir }));
}

module.exports = async () => auth(app);
