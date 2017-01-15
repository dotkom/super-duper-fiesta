const mongoose = require('mongoose');
const logger = require('../logging');

const Schema = mongoose.Schema;


const GenforsSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'open' }, // Open/Closed/Whatever
  pin: { type: Number, required: true, default: parseInt(Math.random() * 10000, 10) },
  password: { type: String, required: true },
});
const Genfors = mongoose.model('Genfors', GenforsSchema);


function getActiveGenfors() {
  return Genfors.findOne({ status: 'open' }).exec();
}


function endGenfors(genfors, user) {
  return canEdit(3, user, genfors, () => {
    Genfors.update({ _id: genfors }, { status: 'Closed' });
  });
}

// TODO add security function
function addGenfors(title, date, passwordHash) {
  // Only allow one at a time
  getActiveGenfors().then((meeting) => {
    // @TODO Prompt user for confirmations and disable active genfors

    if (meeting) return handleError("You can't add a new because there is one active");

    // Add a new genfors
    const genfors = new Genfors({
      title,
      date,
      password: passwordHash,
    });
    genfors.save();
    return null;
  });
}

module.exports = {
  addGenfors,
  endGenfors,
  getActiveGenfors,
};
