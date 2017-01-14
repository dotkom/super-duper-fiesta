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
function getActiveGenfors() {
  return Genfors.findOne({ status: 'Open' }).exec();
}

function addGenfors(title, date, passwordHash, cb) {
  // Only allow one at a time
  getActiveGenfors().catch(handleError).then((meeting) => {
    // @TODO Prompt user for confirmations and disable active genfors

    if (meeting) return handleError("You can't add a new because there is one active");

    // Add a new genfors
    const genfors = new Genfors({
      title,
      date,
      status: 'Open',
      pin: parseInt(Math.random() * 10000, 10),
      password: passwordHash,
    });
    genfors.save().then(cb).catch(handleError);
    return null;
  });
}

function addUser(name, onlinewebId, passwordHash) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      const user = new User({
        genfors,
        name,
        onlineweb_id: onlinewebId,
        register_date: new Date(),
        can_vote: false,
        notes: '',
        security: 0,
      });

      const anonymousUser = new Anonymous_user({
        genfors,
        password_hash: passwordHash,
      });

      Promise.all([user.save(), anonymousUser.save()])
        .then((p) => {
          resolve({ user: p[0], anonymousUser: p[1] });
        }).catch(reject);
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

function canEdit(genfors, user, cb) {
  return getActiveGenfors((active) => {
    if (active === genfors === user.genfors) {
      cb();
    } else {
      logger.error('Unable to end genfors that is not active');
    }
  });
}

function endGenfors(genfors, user, cb) {
  return canEdit(genfors, user, () => {
    Genfors.update({ _id: genfors }, { status: 'Closed' }).then(cb).catch(handleError);
  });
}

function endQuestion(question, user, cb) {
  return canEdit(question.genfors, user, () => {
    Genfors.update({ _id: question }, { active: false }).then(cb).catch(handleError);
  });
}

function setNote(user, targetUser, note, cb) {
  return canEdit(targetUser.genfors, user, () => {
    User.update({ _id: user }).exec().then(cb).catch(handleError);
  });
}

function setCanVote(user, targetUser, canVote, cb) {
  return canEdit(targetUser.genfors, user, () => {
    User.update({ _id: user }).exec().then(cb).catch(handleError);
  });
}


// Get functions
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

function getVotes(question, cb) {
  if (!question.active || !question.secret) {
    return Vote.find({ question }).exec().then(cb).catch(handleError);
  }
  return null;
}

function getQuestions(genfors, cb) {
  return Question.find({ genfors }).exec().then(cb).catch(handleError);
}


module.exports = {
  addGenfors,
  addUser,
  getActiveGenfors,
  getVotes,
  getQuestions,
};
