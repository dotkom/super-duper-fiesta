const db = require('./postgresql');
const { plainObjectOrNull, deprecateObject } = require('./utils');

const Genfors = db.sequelize.models.meeting;

const { MEETING_STATUSES: meetingStates } = require('../../common/actionTypes/meeting');

async function getGenfors(genfors) {
  deprecateObject(genfors);
  const id = genfors.id || genfors;
  return plainObjectOrNull(Genfors.findOne({ where: { id } }));
}

function getActiveGenfors() {
  return plainObjectOrNull(Genfors.findOne({ where: { status: meetingStates.open } }));
}

async function updateGenfors(query, data) {
  deprecateObject(query);
  const id = query.id || query;
  const genfors = await Genfors.findOne({ where: { id } });
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
};
