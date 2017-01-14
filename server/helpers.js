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

function getQualifiedUsers(genfors, secret) {
  if (secret) {
    return AnonymousUser.find({ genfors, can_vote: true });
  }
  return User.find({ genfors, can_vote: true });
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
        onlinewebId,
        registerDate: new Date(),
        canVote: false,
        notes: '',
        security: 0,
      });

      const anonymousUser = new AnonymousUser({
        genfors,
        passwordHash,
      });

      Promise.all([user.save(), anonymousUser.save()])
        .then((p) => {
          resolve({ user: p[0], anonymousUser: p[1] });
        }).catch(reject);
    });
  });
}

function addVoteDemands(title, percent) {
  const voteDemand = new VoteDemand({
    title,
    percent,
  });

  voteDemand.save();
}

function addQuestion(description, options, secret, showOnlyWinner,
  countingBlankVotes, voteDemand) {
  getActiveGenfors().then((genfors) => {
    if (!genfors) return handleError('No genfors active');

    getQualifiedUsers(genfors, secret).then((users) => {
      const question = new Question({
        genfors,
        description,
        active: true,
        deleted: false,
        options, // Format {description, id}
        secret,
        showOnlyWinner,
        countingBlankVotes,
        voteDemand,
        qualifiedVoters: users.length,
      });

      question.save();
    });
    return null;
  });
}

function addVote(_question, user, option) {
  Question.findOne({ _id: _question }).then((err, question) => {
    if (err || !question.active) return handleError(err || 'Not an active question');

    const vote = new Vote({
      user,
      question,
      option,
    });

    vote.save();
    return null;
  });
}


// Update functions
function endGenfors(genfors, user) {
  return canEdit(genfors, user, () => {
    Genfors.update({ _id: genfors }, { status: 'Closed' });
  });
}

function endQuestion(question, user) {
  return canEdit(question.genfors, user, () => {
    Genfors.update({ _id: question }, { active: false });
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
function getUsers(genfors, anonymous) {
  if (anonymous) {
    return AnonymousUser.find({ genfors, canVote: true }).exec();
  }
  return User.find({ genfors, canVote: true }).exec();
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
  addQuestion,
  addUser,
  addVote,
  addVoteDemands,
  endGenfors,
  endQuestion,
  getUsers,
  getVotes,
  getQuestions,
  setNote,
  setCanVote,
};
