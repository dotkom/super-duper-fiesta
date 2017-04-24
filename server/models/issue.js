const mongoose = require('mongoose');
const logger = require('../logging');
const AlternativeSchema = require('./alternative');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;
const getQualifiedUsers = require('./user').getQualifiedUsers;

const permissionLevel = require('../../common/auth/permissions');

const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
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


function getQuestions(genfors) {
  return Question.find({ genfors, deleted: false }).exec();
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

function endQuestion(question, user) {
  return new Promise((resolve, reject) => {
    logger.debug('Closing issue', { issue: question });
    getActiveGenfors().then((genfors) => {
      canEdit(permissionLevel.IS_MANAGER, user, genfors).then((result) => {
        if (result === true) {
          return Question.findByIdAndUpdate(question, { active: false }, { new: true })
          .then(resolve).catch(reject);
        }
        reject(new Error('permission denied'));
        return null;
      }).catch(reject);
    }).catch(reject);
  });
}

function addQuestion(issueData, closeCurrentIssue) {
  return new Promise((resolve, reject) => {
    logger.debug('Creating issue', issueData);
    getActiveGenfors().then((genfors) => {
      if (!genfors) reject(new Error('No genfors active'));

      getActiveQuestion(genfors)
      .catch((err) => {
        logger.error('Something went wrong while getting active questions', err);
      }).then((_issue) => {
        if (_issue && _issue.active && !closeCurrentIssue) {
          reject("There's already an active question");
          return null;
        } else if (_issue && !_issue.active && closeCurrentIssue) {
          logger.warn("There's already an active issue. Closing it and proceeding", {
            issue: _issue.description,
            // user: user,
            closeCurrentIssue,
          });
          endQuestion(_issue);
        }
        // removed possible issues and proceeding to create a new one
        getQualifiedUsers(genfors).then((users) => {
          const issue = Object.assign(issueData, {
            genfors,
            qualifiedVoters: users.length,
            currentVotes: 0,
          });
          logger.debug('Created issue', { issue });

          // @ToDo: Create alternatives, map it to issue obj, then create issue.
          return new Question(issue).save().then(resolve).catch(reject);
        }).catch(reject);
        return null;
      });
    }).catch(reject);
  });
}

async function deleteIssue(issue, user) {
  const genfors = await getActiveGenfors();
  const userCanEdit = await canEdit(permissionLevel.IS_MANAGER, user, genfors);
  if (userCanEdit) {
    return Question.findByIdAndUpdate(issue, { active: false, deleted: true }, { new: true });
  }
  return null;
}

module.exports = {
  addIssue: addQuestion,
  getActiveQuestion,
  getClosedQuestions,
  getIssueById,
  getQuestions,
  endIssue: endQuestion,
  // updateQuestionCounter,
  deleteIssue,
};
