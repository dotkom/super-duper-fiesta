const db = require('./postgresql');

const Vote = db.sequelize.models.vote;

function getVotes(question) {
  return Vote.find({ question });
}

function getUserVote(issue, user) {
  return Vote.findOne({ question: issue, user });
}

async function haveIVoted(issue, user) {
  const vote = await getUserVote(issue, user);
  return !!vote;
}

function createVote(user, question, alternative) {
  return new Vote({
    user,
    question,
    alternative,
  });
}

module.exports = {
  getVotes,
  haveIVoted,
  createVote,
  getUserVote,
};
