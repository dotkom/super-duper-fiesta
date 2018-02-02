const Sequelize = require('sequelize');
const connection = require('./postgresql');

const { VOTING_NOT_STARTED, VOTING_FINISHED } = require('../../common/actionTypes/issues');


let Question;

async function QuestionModel(sequelize, DataTypes) {
  let Genfors;
  try {
    Genfors = await sequelize.import('./meetingModel');
  } catch (err) {
    console.log('Importing failed', err);
  }
  const model = await sequelize.define('issue', {
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    secret: DataTypes.BOOLEAN,
    showOnlyWinner: DataTypes.BOOLEAN,
    countingBlankVotes: DataTypes.BOOLEAN,
    // voteDemand: Either "regular" or "qualified".
    voteDemand: DataTypes.STRING,
    qualifiedVoters: DataTypes.SMALLINT,
    currentVotes: DataTypes.SMALLINT,
    result: DataTypes.BOOLEAN,
    // status types: NOT_STARTED, IN_PROGRESS, FINISHED
    status: DataTypes.TEXT,
  });
  // await model.belongsTo(Genfors);
  return model;
}
(async () => { Question = await QuestionModel(await connection(), Sequelize); })();

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
