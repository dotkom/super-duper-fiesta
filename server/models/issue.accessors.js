const db = require('./postgresql');

const { VOTING_FINISHED } = require('../../common/actionTypes/issues');

const Question = db.sequelize.models.issue;

async function addIssue(issue) {
  return Question.create(issue);
}

function getConcludedIssues(genfors) {
  const id = genfors.id || genfors;
  return Question.findAll({ where:
    { meetingId: id, deleted: false, active: false },
  });
}

const getIssueById = id => (
  Question.findOne({ where: { id } })
);
function getActiveQuestion(genfors) {
  // const genforsId = genfors.id || genf
  return Question.findOne({ where:
    { meetingId: genfors, active: true, deleted: false },
  });
}

async function updateIssue(issueOrId, data) {
  const id = issueOrId.id || issueOrId;
  const issue = await getIssueById(id);
  return Object.assign(issue, data).save();
}

async function deleteIssue(issue) {
  const id = issue.id || issue;
  return updateIssue(id,
    { active: false, deleted: true, status: VOTING_FINISHED },
    { new: true });
}

function endIssue(issue) {
  const id = issue.id || issue;
  return updateIssue(id,
    { active: false, status: VOTING_FINISHED },
    { new: true });
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
