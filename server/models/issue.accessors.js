const db = require('./postgresql');

const { VOTING_FINISHED } = require('../../common/actionTypes/issues');

const Question = db.sequelize.models.issue;

async function addIssue(issue) {
  return Question.create(issue);
}

function getConcludedIssues(genfors) {
  const id = genfors.id || genfors;
  return Question.findOne({ where:
    { id, deleted: false, active: false },
  });
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
