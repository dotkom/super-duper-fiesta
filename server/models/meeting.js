const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const GenforsSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  registrationOpen: { type: Boolean, required: true, default: false },
  status: { type: String, default: 'open' }, // Open/Closed/Whatever
  pin: { type: Number, required: true, default: parseInt(Math.random() * 10000, 10) },
});
const Genfors = mongoose.model('Genfors', GenforsSchema);

const getGenfors = id => (
  Genfors.findOne({ _id: id })
);

function getActiveGenfors() {
  return Genfors.findOne({ status: 'open' }).exec();
}

async function createGenfors(title, date) {
  // Add a new genfors
  const genfors = new Genfors({
    title,
    date,
  });
  return genfors.save();
}

async function closeGenfors(id) {
  Genfors.update({ _id: id }, { status: 'closed' });
}

async function toggleRegistrationStatus(genfors, currentStatus) {
  // If currentStatus is passed to func, set it to the opposite
  // If currentStatus is not passed to func, set it to the opposite of meeting.registrationOpen
  const registrationOpen = currentStatus !== undefined ? !currentStatus : genfors.registrationOpen;

  // eslint-disable-next-line no-underscore-dangle
  return Genfors.findOneAndUpdate(genfors._id,
  { registrationOpen, pin: parseInt(Math.random() * 10000, 10) }, { new: true });
}

module.exports = {
  getGenfors,
  createGenfors,
  closeGenfors,
  getActiveGenfors,
  toggleRegistrationStatus,
};
