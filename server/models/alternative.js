const Sequelize = require('sequelize');
const connection = require('./postgresql');

const { Issue } = require('./issue');

let Alternative;

async function AlternativeModel(sequelize, DataTypes) {
  const model = await sequelize.define('Alternative', {
    text: DataTypes.TEXT,
  });
  model.belongsTo(Issue);
  return model;
}
(async () => { Alternative = await AlternativeModel(await connection(), Sequelize); })();

module.exports = Alternative;
