const mongoose = require('mongoose');
const AlternativeSchema = require('./alternative');
const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../common/actionTypes/issues');

const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, required: true, default: false },
  alternatives: [AlternativeSchema],
  secret: { type: Boolean, default: false },
  showOnlyWinner: { type: Boolean, default: true },
  countingBlankVotes: { type: Boolean, default: true },
  voteDemand: { type: String, required: true }, // Either "regular" or "qualified".
  qualifiedVoters: Number,
  currentVotes: { type: Number, default: 0 },
  result: Boolean,
  // status types: NOT_STARTED, IN_PROGRESS, FINISHED
  status: { type: String, required: true, default: VOTING_NOT_STARTED },
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

function endIssue(issue) {
  return Question.findByIdAndUpdate(issue,
    { active: false, status: VOTING_FINISHED },
    { new: true });
}

function deleteIssue(issue) {
  return Question.findByIdAndUpdate(issue,
    { active: false, deleted: true, status: VOTING_FINISHED },
    { new: true });
}

function updateIssue(issue, data, options) {
  return Question.findOneAndUpdate(issue, data, options);
}

module.exports = {
  addIssue,
  getActiveQuestion,
  getClosedQuestions: getConcludedIssues,
  getIssueById,
  getConcludedIssues,
  endIssue,
  deleteIssue,
  updateIssue,
};
