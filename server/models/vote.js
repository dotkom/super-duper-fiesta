const mongoose = require('mongoose');
const logger = require('../logging');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;

const Schema = mongoose.Schema;


const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  option: { type: Number, required: true },
});
const Vote = mongoose.model('Vote', VoteSchema);


function getVotes(question, cb) {
  if (!question.active || !question.secret) {
    return Vote.find({ question }).exec();
  }
  return null;
}

//TODO fix promise
function addVote(_question, user, option) {
  Question.findOne({ _id: _question }).then((err, question) => {
    if (err || !question.active) return handleError(err || 'Not an active question');

    const vote = new Vote({
      user,
      question,
      option,
    });

    vote.save();
    updateQuestionCounter(question);
    return null;
  });
}

module.exports = {
  addVote,
  getVotes,
};
