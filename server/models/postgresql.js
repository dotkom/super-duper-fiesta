const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../logging');
const config = require('../../config');

const db = {};

const SDF_DB_POOL_MIN = process.env.SDF_DB_POOL_MIN || 0;
const SDF_DB_POOL_MAX = process.env.SDF_DB_POOL_MAX || 5;
const SDF_DB_POOL_ACQUIRE = process.env.SDF_DB_POOL_ACQUIRE || 30000;
const SDF_DB_POOL_IDLE = process.env.SDF_DB_POOL_IDLE || 10000;

const sequelize = new Sequelize(config.database.uri, {
  dialect: 'postgres',
  // Use winston for logging.
  // See https://github.com/sequelize/sequelize/issues/7821#issuecomment-311564259
  logging: msg => logger.silly(msg),
  pool: {
    max: SDF_DB_POOL_MAX,
    min: SDF_DB_POOL_MIN,
    acquire: SDF_DB_POOL_ACQUIRE,
    idle: SDF_DB_POOL_IDLE,
  },
  operatorsAliases: false,
});

// Import all models
Promise.all(fs.readdirSync(__dirname)
  .filter(file =>
    // Ignore hidden files
    (file.indexOf('.') !== 0)
      // Ignore this file
      && (file !== path.basename(__filename))
      // Ignore all non-js files
      && (file.slice(-3) === '.js')
      // Ignore files containing only accessor functions (getters and setters)
      // (These requires the model to be imported first)
      && (file.search('.accessors.') === -1),
  )
  .map(async (file) => {
    try {
      const model = await sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    } catch (err) {
      logger.error(`import of model from file "${file}" failed`, err);
    }
  })).then(async () => {
    logger.debug('Imported all models, starting association.');
    Object.keys(db)
      .filter(key => (key.search(/sequelize/i) === -1))
      .map(async (model) => {
        if (db[model].associate) {
          await db[model].associate(db);
        }
      });
    logger.info('Done setting up database.');
  })
  .catch((err) => {
    logger.error('Error during association of model relations', err);
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
