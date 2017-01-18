const mongoose = require('mongoose');
const logger = require('../logging');
const AlternativeSchema = require('./alternative');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;
const getVotes = require('./vote').getVotes;
const getQualifiedUsers = require('./user').getQualifiedUsers;

const permissionLevel = require('./permissions');

const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  options: [AlternativeSchema],
  secret: { type: Boolean, default: false },
  showOnlyWinner: { type: Boolean, default: true },
  countingBlankVotes: { type: Boolean, default: true },
  voteDemand: { type: Number, required: true },
  qualifiedVoters: Number,
  currentVotes: { type: Number, default: 0 },
  result: Boolean,
});
const Question = mongoose.model('Question', QuestionSchema);


function getQuestions(genfors) {
  return Question.find({ genfors }).exec();
}
function getActiveQuestion(genfors) {
  return Question.findOne({ genfors, active: true }).exec();
}
function getClosedQuestions(genfors) {
  return Question.find({ genfors, active: false }).exec();
}

function endQuestion(question, user) {
  return new Promise((resolve, reject) => {
    logger.debug('endquestion', { question });
    getActiveGenfors().then((genfors) => {
      canEdit(permissionLevel.IS_MANAGER, user, genfors).then((result) => {
        logger.debug('security check returned', { result });
        if (result === true) {
          return Question.findByIdAndUpdate(question, { active: false })
          .then(resolve).catch(reject);
        }
        return reject(new Error('permission denied'));
      }).catch(reject);
    }).catch(reject);
  });
}

// TODO Fix
function updateQuestionCounter(question) {
  getVotes(question, (votes) => {
    Question.update({ _id: question }, { currentVotes: votes.length })
    .exec();
  });
}

function addQuestion(issueData, closeCurrentIssue) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      if (!genfors) reject(new Error('No genfors active'));

      getActiveQuestion(genfors)
      .catch((err) => {
        logger.error('Something went wrong while getting active questions', { err });
      }).then((_issue) => {
        if (_issue && _issue.active && !closeCurrentIssue) {
          reject("There's already an active question");
          return null;
        } else if (_issue && !_issue.active && closeCurrentIssue) {
          logger.info("There's already an active issue. Closing it and proceeding", {
            issue: _issue.description,
            // user: user,
            closeCurrentIssue,
          });
          endQuestion(_issue);
        }
        getQualifiedUsers(genfors, issueData.secret).then((users) => {
          const issue = Object.assign(issueData, {
            genfors,
            active: true,
            deleted: false,
            qualifiedVoters: users.length,
            currentVotes: 0,
          });

          // @ToDo: Create alternatives, map it to issue obj, then create issue.
          return new Question(issue).save().catch(reject).then(resolve);
        });
        return null;
      });
    }).catch(reject);
  });
}

module.exports = {
  addQuestion,
  getActiveQuestion,
  getClosedQuestions,
  getQuestions,
  endQuestion,
};
