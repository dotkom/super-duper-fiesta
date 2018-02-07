const db = require('./postgresql');

const Genfors = db.sequelize.models.meeting;

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
