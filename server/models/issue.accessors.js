const db = require('./postgresql');
const logger = require('../logging');
const { plainObject, plainObjectOrNull } = require('./utils');

const { VOTING_FINISHED } = require('../../common/actionTypes/issues');

const Alternative = db.sequelize.models.alternative;
const Question = db.sequelize.models.issue;

async function addIssue(issueData, alternatives) {
  return db.sequelize.transaction(async (transaction) => {
    if (!alternatives || alternatives.length < 1) {
      logger.error('Tried to add issue without adding alternatives');
      throw new Error('An issue requires alternatives.');
    }

    const issue = await Question.create(issueData, { transaction });
    await Promise.all(alternatives.map(async alternative =>
      // Override ID coming from frontend.
      Alternative.create(Object.assign(alternative, { id: undefined, issueId: issue.id }),
      { transaction }),
    ));

    return issue;
  });
}

function getConcludedIssues(genfors) {
  const id = genfors.id || genfors;
  return Question.findAll({ where:
    { meetingId: id, deleted: false, active: false },
  }).map(plainObject);
}

const getIssueById = (id, options) => (
  plainObjectOrNull(Question.findOne({ where: { id }, ...options }))
);

async function getIssueWithAlternatives(id, options) {
  return getIssueById(id, { include: [Alternative], ...options });
}

async function getActiveQuestion(genfors) {
  const meetingId = (genfors && genfors.id) || genfors;
  return plainObjectOrNull(Question.findOne({ where:
    { meetingId, active: true, deleted: false },
    include: [Alternative],
  }));
}

async function updateIssue(issueOrId, data) {
  const id = issueOrId.id || issueOrId;
  const issue = await Question.findOne({ where: { id } });
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
  return updateIssue(id, { active: false, status: VOTING_FINISHED });
}

module.exports = {
  addIssue,
  getActiveQuestion,
  getClosedQuestions: getConcludedIssues,
  getIssueById,
  getIssueWithAlternatives,
  getConcludedIssues,
  endIssue,
  deleteIssue,
  updateIssue,
};
