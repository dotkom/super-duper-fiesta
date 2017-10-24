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

async function updateGenfors(genfors, data, options) {
  return Genfors.findOneAndUpdate(genfors, data, options);
}

async function createGenfors(title, date) {
  // Add a new genfors
  const genfors = new Genfors({
    title,
    date,
  });
  return genfors.save();
}

module.exports = {
  getGenfors,
  createGenfors,
  getActiveGenfors,
  updateGenfors,
};
