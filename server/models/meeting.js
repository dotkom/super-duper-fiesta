const Sequelize = require('sequelize');
const connection = require('./postgresql');


let Genfors;

async function GenforsModel(sequelize, DataTypes) {
  const model = await sequelize.define('meeting', {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    registrationOpen: DataTypes.BOOLEAN,
    status: DataTypes.TEXT,
    pin: DataTypes.SMALLINT,
  });
  return model;
}
(async () => { Genfors = await GenforsModel(await connection(), Sequelize); })();


async function getGenfors(genfors) {
  const id = genfors.id || genfors;
  return Genfors.findById(id);
}

function getActiveGenfors() {
  return Genfors.findOne({ where: { status: 'open' } });
}

async function updateGenfors(query, data) {
  const id = query.id || query;
  const genfors = await getGenfors(id);
  return Object.assign(genfors, data).save();
}

async function createGenfors(meeting) {
  return Genfors.create(meeting);
}

module.exports = {
  getGenfors,
  createGenfors,
  getActiveGenfors,
  updateGenfors,
};
