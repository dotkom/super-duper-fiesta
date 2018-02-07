const db = require('./postgresql');

const Vote = db.sequelize.models.vote;

function getVotes(question) {
  const issueId = question.id || question;
  return Vote.findAll({ where: { issueId } });
}

function getUserVote(issue, user) {
  const issueId = issue.id || issue;
  const userId = user.id || user;
  return Vote.findOne({ where: { issueId, userId } });
}

async function haveIVoted(issue, user) {
  const vote = await getUserVote(issue, user);
  return !!vote;
}

function createVote(user, question, alternative) {
  const userId = user.id || user;
  const issueId = question.id || question;
  const alternativeId = alternative.id || alternative;
  return Vote.create({ userId, issueId, alternativeId });
}

module.exports = {
  getVotes,
  haveIVoted,
  createVote,
  getUserVote,
};
