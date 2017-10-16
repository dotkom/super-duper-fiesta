const mongoose = require('mongoose');
const AlternativeSchema = require('./alternative');

const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: new Date() },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, required: true, default: false },
  options: [AlternativeSchema],
  secret: { type: Boolean, default: false },
  showOnlyWinner: { type: Boolean, default: true },
  countingBlankVotes: { type: Boolean, default: true },
  voteDemand: { type: String, required: true }, // Either "regular" or "qualified".
  qualifiedVoters: Number,
  currentVotes: { type: Number, default: 0 },
  result: Boolean,
});
const Question = mongoose.model('Question', QuestionSchema);

function addIssue(issue) {
  return new Question(issue).save();
}

function getConcludedIssues(genfors) {
  return Question.find({ genfors, deleted: false, active: false }).exec();
}

const getIssueById = id => (
  Question.findOne({ _id: id })
);
function getActiveQuestion(genfors) {
  return Question.findOne({ genfors, active: true, deleted: false });
}
function getClosedQuestions(genfors) {
  return Question.find({ genfors, active: false, deleted: false }).exec();
}

function endIssue(issue) {
  return Question.findByIdAndUpdate(issue, { active: false }, { new: true });
}

function deleteIssue(issue) {
  return Question.findByIdAndUpdate(issue, { active: false, deleted: true }, { new: true });
}

module.exports = {
  addIssue,
  getActiveQuestion,
  getClosedQuestions,
  getIssueById,
  getConcludedIssues,
  endIssue,
  // updateQuestionCounter,
  deleteIssue,
};
