const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  alternative: { type: Schema.Types.ObjectId, required: true },
});
const Vote = mongoose.model('Vote', VoteSchema);


function getVotes(question) {
  return Vote.find({ question });
}

async function haveIVoted(issue, user) {
  const votes = await Vote.find({ question: issue, user });
  return votes.length > 0;
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
};
