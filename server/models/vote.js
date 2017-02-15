const mongoose = require('mongoose');
const logger = require('../logging');
const canEdit = require('./meeting').canEdit;
const permissionLevel = require('./permissions');

const Schema = mongoose.Schema;


const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  option: { type: Number, required: true },
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

function addVote(question, user, option, anonymousUser) {
  return new Promise((resolve, reject) => {
    if (!question.active) {
      reject();
      return;
    }
    canEdit(permissionLevel.CAN_VOTE, user, question.genfors).then(() => {
      haveIVoted(question, user, anonymousUser).then(() => {
        const vote = new Vote({
          user,
          question,
          option,
        });
        vote.save().then(resolve).catch(reject);
      }).catch(() => {
        reject('Sorry, you have voted');
      });
    }).catch(reject);
  });
}

module.exports = {
  addVote,
  getVotes,
};
