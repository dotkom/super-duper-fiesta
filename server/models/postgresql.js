const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../logging');

const DATABASE_URL = process.env.DATABASE_URL;

const db = {};

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // Use winston for logging.
  // See https://github.com/sequelize/sequelize/issues/7821#issuecomment-311564259
  logging: msg => logger.silly(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
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
      && (file.search('.accessors.') === -1)
      && (file !== 'essentials.js'), // Ignore mongodb file
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
