const db = require('./postgresql');

const Genfors = db.sequelize.models.meeting;

const meetingStates = { open: 'open', closed: 'closed' };

async function getGenfors(genfors) {
  const id = genfors.id || genfors;
  return Genfors.findOne({ where: { id } });
}

function getActiveGenfors() {
  return Genfors.findOne({ where: { status: meetingStates.open } });
}

async function updateGenfors(query, data) {
  const id = query.id || query;
  const genfors = await getGenfors(id);
  return Object.assign(genfors, data).save();
}

async function createGenfors(title, date) {
  const meeting = { title, date };
  return Genfors.create(meeting);
}

module.exports = {
  getGenfors,
  createGenfors,
  getActiveGenfors,
  updateGenfors,
  meetingStates,
};
