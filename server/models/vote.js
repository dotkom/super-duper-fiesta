const mongoose = require('mongoose');
const logger = require('../logging');
const canEdit = require('./meeting').canEdit;
const permissionLevel = require('./permissions');
const getIssueById = require('./issue').getIssueById;

const Schema = mongoose.Schema;


const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  option: { type: Schema.Types.ObjectId, required: true },
});
const Vote = mongoose.model('Vote', VoteSchema);


function getVotes(question) {
  if (!question.active || !question.secret) {
    return Vote.find({ question }).exec();
  }
  return null;
}

function haveIVoted(question, user, anonymousUser) {
  return new Promise((resolve, reject) => {
    Vote.find({ question, user }).exec().then((vote) => {
      if (Object.keys(vote).length > 0) {
        // It didn't fail so user has voted!
        reject(); // !!!!!
      } else {
        Vote.find({ question, user: anonymousUser }).exec().then((_vote) => {
          if (Object.keys(_vote).length > 0) {
            // It didn't fail so user has voted!
            reject(); // !!!!!
          } else {
            resolve();
          }
        }).catch();
      }
    }).catch();
  }).catch();
}

function addVote(issueId, user, option, anonymousUser) {
  return new Promise((resolve, reject) => {
    getIssueById(issueId)
    .then((issue) => {
      logger.debug('Storing vote.', { issueId, user: user.onlinewebId, anonymousUser });
      if (!issue.active) {
        logger.warn('Tried to vote on inactive issue!', { issueId, user: user.onlinewebId, anonymousUser });
        reject();
        return;
      }
      logger.silly('Checking permissions.', { issueId, user: user.onlinewebId });
      canEdit(permissionLevel.CAN_VOTE, user, issue.genfors).then(() => {
        haveIVoted(issueId, user, anonymousUser).then(() => {
          const vote = new Vote({
            user: user._id, // eslint-disable-line no-underscore-dangle
            question: issueId,
            option,
          });
          logger.debug('Storing vote.', { issueId, user: user.onlinewebId, anonymousUser });
          vote.save().then(resolve).catch(reject);
        }).catch((err) => {
          logger.debug('User has already voted!', { issueId, user: user.onlinewebId, anonymousUser });
          logger.silly('User has already voted err.', err);
          reject('Sorry, you have voted');
        });
      }).catch((err) => {
        logger.warn('User tried to vote without having appropriate permissions.', {
          issueId,
          user: user.onlinewebId,
          anonymousUser,
          requiredPerms: permissionLevel.CAN_VOTE,
          hadPerms: user.permissions,
        });
        reject(err);
      });
    }).catch((err) => {
      logger.error('Retrieving issue for vote failed!', err, { issueId });
    });
  });
}

module.exports = {
  addVote,
  getVotes,
};
