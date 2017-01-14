const AnonymousUser = require('./scheme').AnonymousUser;
const Genfors = require('./scheme').Genfors;
const Question = require('./scheme').Question;
const User = require('./scheme').User;
const Vote = require('./scheme').Vote;
const VoteDemand = require('./scheme').VoteDemand;
const logger = require('./logging');

function handleError(err) {
  logger.error('Error doing something', { err });
}

// Useful functions
function getActiveGenfors() {
  return Genfors.findOne({ status: 'Open' }).exec();
}

function canEdit(genfors, user, securityLevel, cb) {
  return getActiveGenfors((active) => {
    if (active === genfors === user.genfors && user.permissions > securityLevel) {
      cb();
    } else {
      logger.error('Unable to end genfors that is not active');
    }
  });
}


// Add functions
// TODO add security function
function addGenfors(title, date, passwordHash) {
  // Only allow one at a time
  getActiveGenfors().then((meeting) => {
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
    genfors.save();
    return null;
  });
}

function addUser(name, onlinewebId, passwordHash) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      const user = new User({
        genfors,
        name,
        onlinewebId: onlinewebId,
        registerDate: new Date(),
        canVote: false,
        notes: '',
        security: 0,
      });

      const anonymousUser = new AnonymousUser({
        genfors,
        passwordHash: passwordHash,
      });

      Promise.all([user.save(), anonymousUser.save()])
        .then((p) => {
          resolve({ user: p[0], anonymousUser: p[1] });
        }).catch(reject);
    });
  });
}


function addVoteDemands(title, percent, cb) {
  const voteDemand = new VoteDemand({
    title,
    percent,
  });

  voteDemand.save((err) => {
    if (err) return handleError(err);
    cb(voteDemand);
  });
}


function addQuestion(description, options, secret, showOnlyWinner, countingBlankVotes, VoteDemand, cb) {
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
        showOnlyWinner,
        countingBlankVotes,
        VoteDemand,
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


function endGenfors(genfors, user, cb) {
  return canEdit(3, user, genfors, () => {
    Genfors.update({ _id: genfors }, { status: 'Closed' }).then(cb).catch(handleError);
  });
}

function endQuestion(question, user, cb) {
  return canEdit(2, user, question.genfors, () => {
    Genfors.update({ _id: question }, { active: false }).then(cb).catch(handleError);
  });
}

function setNote(user, targetUser, note, cb) {
  return canEdit(2, user, targetUser.genfors, () => {
    User.update({ _id: user }).exec().then(cb).catch(handleError);
  });
}

function setCanVote(user, targetUser, canVote, cb) {
  return canEdit(2, user, targetUser.genfors, () => {
    User.update({ _id: user }).exec().then(cb).catch(handleError);
  });
}


// Get functions
function getUsers(genfors, anonymous, cb) {
  if (anonymous) {
    return AnonymousUser.find({ genfors }).exec().then(cb).catch(handleError);
  }
  return User.find({ genfors }).exec().then(cb).catch(handleError);
}

function getQualifiedUsers(genfors, secret, cb) {
  if (secret) {
    return AnonymousUser.find({ genfors, canVote: true }).exec().then(cb).catch(handleError);
  }
  return User.find({ genfors, canVote: true }).exec().then(cb).catch(handleError);
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
  getActiveGenfors,
  addGenfors,
  addUser,
  addVote,
  addQuestion,
  addVoteDemands,
  endGenfors,
  endQuestion,
  setNote,
  setCanVote,
  getUsers,
  getVotes,
  getQuestions,
};
