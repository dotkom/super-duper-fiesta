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
  return Genfors.findOne({ status: 'open' }).exec();
}

function canEdit(securityLevel, user, genfors, cb) {
  return getActiveGenfors().then((active) => {
    if (active.id === genfors.id && genfors.id === user.genfors.toString()
    && user.permissions >= securityLevel) {
      logger.debug('cleared security check');
      cb();
    } else {
      logger.error('Failed security check');
      logger.debug('permission', user.permissions >= 3);
      logger.debug(active.id === genfors.id && genfors.id === user.genfors.toString()
        && user.permissions >= securityLevel);
    }
  });
}

function getQualifiedUsers(genfors, secret) {
  if (secret) {
    return AnonymousUser.find({ genfors, can_vote: true });
  }
  return User.find({ genfors, can_vote: true });
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
function getActiveQuestions(genfors, cb) {
  return Question.find({ genfors, active: true }).exec().then(cb).catch(handleError);
}
function getClosedQuestions(genfors, cb) {
  return Question.find({ genfors, active: false }).exec().then(cb).catch(handleError);
}


// Update functions
function endGenfors(genfors, user) {
  return canEdit(3, user, genfors, () => {
    Genfors.update({ _id: genfors }, { status: 'Closed' });
  });
}

function endQuestion(question, user) {
  return canEdit(2, user, question.genfors, () => {
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

function updateQuestionCounter(question) {
  getVotes(question, (votes) => {
    Question.update({ _id: question }, { currentVotes: votes.length })
    .exec().then().catch(handleError);
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
      password: passwordHash,
    });
    genfors.save();
    return null;
  });
}

function addUser(name, onlinewebId, passwordHash, securityLevel) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      const user = new User({
        genfors,
        name,
        onlinewebId,
        notes: '',
        permissions: securityLevel || 0,
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

function addQuestion(issueData, closeCurrentIssue) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      if (!genfors) reject('No genfors active');

      getActiveQuestions(genfors)
      .catch((err) => {
        logger.error('Something went wrong while getting active questions', { err });
      }).then((_issue) => {
        if (_issue && !closeCurrentIssue) {
          reject("There's already an active question");
        } else if (_issue && closeCurrentIssue) {
          logger.info("There's already an active isse. Closing it and proceeding", {
            issue: _issue.description,
            // user: user,
            closeCurrentIssue,
          });
          endQuestion(_issue);
        }
        getQualifiedUsers(genfors, issueData.secret).then((users) => {
          const issue = Object.assign(issueData, {
            genfors,
            active: true,
            deleted: false,
            qualifiedVoters: users.length,
            currentVotes: 0,
          });

          return issue.save().catch(reject).then(resolve);
        });
      });
    }).catch(reject);
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
    updateQuestionCounter(question);
    return null;
  });
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
  setNote,
  setCanVote,
  getUsers,
  getVotes,
  getQuestions,
  getActiveQuestions,
  getClosedQuestions,
};
