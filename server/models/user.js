const mongoose = require('mongoose');
const logger = require('../logging');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: false },
  name: { type: String, required: true },
  onlinewebId: { type: String, required: true },
  registerDate: { type: Date, default: Date.now() },
  canVote: { type: Boolean, default: false },
  notes: String,
  permissions: { type: Number, default: 0 },
});

const AnonymousUserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const AnonymousUser = mongoose.model('AnonymousUser', AnonymousUserSchema);


function getQualifiedUsers(genfors, secret) {
  if (secret) {
    return AnonymousUser.find({ genfors, can_vote: true });
  }
  return User.find({ genfors, can_vote: true });
}

function getUserById(userId, anonymous) {
  if (anonymous) {
    return AnonymousUser.findOne({ _id: userId }).exec();
  }
  return User.findOne({ _id: userId }).exec();
}

function getUsers(genfors, anonymous) {
  if (anonymous) {
    return AnonymousUser.find({ genfors, canVote: true }).exec();
  }
  return User.find({ genfors, canVote: true }).exec();
}


function addUser(name, onlinewebId, passwordHash, securityLevel) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      if (!genfors && securityLevel < 3) {// TODO make sure to connect all users to genfors
        return reject(new Error('Ingen aktive generalforsamlinger'));
      }
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
      return null;
    });
  });
}


//TODO fix promise
function setNote(user, targetUser, note, cb) {
  return canEdit(2, user, targetUser.genfors, () => {
    User.update({ _id: user }).exec();
  });
}

function setCanVote(user, targetUser, canVote, cb) {
  return canEdit(2, user, targetUser.genfors, () => {
    User.update({ _id: user }).exec();
  });
}

module.exports = {
  addUser,
  getUsers,
  getUserById,
  getQualifiedUsers,
  setNote,
  setCanVote,
};
