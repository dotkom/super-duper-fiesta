const db = require('./postgresql');
const { plainObject, plainObjectOrNull, deprecateObject } = require('./utils');

const Vote = db.sequelize.models.vote;

function getVotes(question) {
  deprecateObject(question);
  const issueId = question.id || question;
  return Vote.findAll({
    where: { issueId },
    order: ['createdAt'],
  }).map(plainObject);
}

function getUserVote(issue, user) {
  deprecateObject(issue);
  const issueId = issue.id || issue;
  const userId = user.id || user;
  return plainObjectOrNull(Vote.findOne({ where: { issueId, userId } }));
}

function getAnonymousUserVote(issueId, anonymoususerId) {
  return plainObjectOrNull(Vote.findOne({ where: { issueId, anonymoususerId } }));
}


function createUserVote(userId, issueId, alternativeId) {
  return Vote.create({ userId, issueId, alternativeId });
}

function createAnonymousVote(anonymoususerId, issueId, alternativeId) {
  return Vote.create({ anonymoususerId, issueId, alternativeId });
}

module.exports = {
  getVotes,
  createUserVote,
  createAnonymousVote,
  getUserVote,
  getAnonymousUserVote,
};
