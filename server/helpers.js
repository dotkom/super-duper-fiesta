const Anonymous_user = require('./scheme').Anonymous_user;
const Genfors = require('./scheme').Genfors;
const Question = require('./scheme').Question;
const User = require('./scheme').User;
const Vote = require('./scheme').Vote;
const Vote_demand = require('./scheme').Vote_demand;
const logger = require('./logging');

function handleError(err) {
  logger.error('Error doing something', { err });
}

// Get requests
function getActiveGenfors(cb) {
  return Genfors.findOne({ status: 'Open' }).exec().then(cb).catch(handleError);
}

function addGenfors(title, date, passwordHash, cb) {
  // Only allow one at a time
  getActiveGenfors((genfors) => {
    // @TODO Prompt user for confirmations and disable active genfors

    if (genfors) return handleError("You can't add a new because there is one active");

    // Add a new genfors
    var genfors = new Genfors({
      title,
      date,
      status: 'Open',
      pin: parseInt(Math.random() * 10000),
      password: passwordHash,
    });
    genfors.save((err) => {
      if (err) return handleError(err);
      cb(genfors);
    });
  });
}

function addUser(name, onlineweb_id, password_hash, cb) {
  getActiveGenfors((genfors) => {
    if (!genfors) return handleError('No active genfors');
    const user = new User({
      genfors,
      name,
      onlineweb_id,
      register_date: new Date(),
      can_vote: false,
      notes: '',
      security: 0,
    });

    const anonymousUser = new Anonymous_user({
      genfors,
      password_hash,
    });

    user.save((err) => {
      if (err) return handleError(err);
      anonymousUser.save((err) => {
        if (err) return handleError(err);
        cb(user, anonymousUser);
      });
    });
  });
}


function addVoteDemands(title, percent, cb) {
  const voteDemand = new Vote_demand({
    title,
    percent,
  });

  voteDemand.save((err) => {
    if (err) return handleError(err);
    cb(voteDemand);
  });
}


function addQuestion(description, options, secret, show_only_winner, counting_blank_votes, vote_demand, cb) {
  getActiveGenfors((genfors) => {
    if (!genfors) return handleError('No genfors active');

    getQualifiedUsers(genfors, secret, (users) => {
      const question = new Question({
        genfors,
        description,
        active: true,
        deleted: false,
        options, // Format {description, id}
        secret,
        show_only_winner,
        counting_blank_votes,
        vote_demand,
        qualifiedVoters: users.length,
      });

      question.save((err) => {
        if (err) return handleError(err);
        cb(question);
      });
    });
  });
}

function addVote(question, user, option, cb) {
  Question.findOne({ _id: question }, (err, question) => {
    if (err || !question.active) return handleError(err || 'Not an active question');

    const vote = new Vote({
      user,
      question,
      option,
    });
    vote.save((err) => {
      if (err) return handleError(err);
      cb(vote);
    });
  });
}

// Update functions
// TODO Unable activity if genfors is ended
function endGenfors(genfors, cb) {
  Genfors.update({ _id: genfors }, { status: 'Closed' }, cb);
}
function endQuestion(question, cb) {
  Genfors.update({ _id: question }, { active: false }, cb);
}

function getUsers(genfors, anonymous, cb) {
  if (anonymous) {
    Anonymous_user.find({ genfors }, (err, users) => {
      if (err) return handleError(err);
      cb(users);
    });
  } else {
    User.find({ genfors }, (err, users) => {
      if (err) return handleError(err);
      cb(users);
    });
  }
}

function getQualifiedUsers(genfors, secret, cb) {
  if (secret) {
    return Anonymous_user.find({ genfors, can_vote: true }, (err, users) => {
      if (err) return handleError(err);
      cb(users);
    });
  } else {
    return User.find({ genfors, can_vote: true }, (err, users) => {
      if (err) return handleError(err);
      cb(users);
    });
  }
}

module.exports = {
  addGenfors,
  getActiveGenfors,
};
