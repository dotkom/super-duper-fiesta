const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL;

const db = {};

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Import all models
fs.readdirSync(__dirname)
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
  .forEach(async (file) => {
    try {
      const model = await sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    } catch (err) {
      console.log(`import of model from file "${file}" failed`, err);
    }
  });

Object.keys(db).forEach(async (model) => {
  if (db[model].associate) {
    await db[model].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
