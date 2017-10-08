const mongoose = require('mongoose');
const logger = require('../logging');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;
const { hashWithSalt } = require('../utils/crypto');

const permissionLevel = require('../../common/auth/permissions');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: false },
  name: { type: String, required: true, unique: true },
  onlinewebId: { type: String, required: true, unique: true },
  registerDate: { type: Date, default: Date.now() },
  canVote: { type: Boolean, default: false },
  notes: String,
  permissions: { type: Number, default: 0 },
  completedRegistration: { type: Boolean, default: false },
});

const AnonymousUserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: false },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const AnonymousUser = mongoose.model('AnonymousUser', AnonymousUserSchema);


function getQualifiedUsers(genfors) {
  return User.find({ genfors, canVote: true, permissions: { $gte: permissionLevel.CAN_VOTE } });
}

function getUserById(userId, anonymous) {
  if (anonymous) {
    return AnonymousUser.findOne({ _id: userId });
  }
  return User.findOne({ _id: userId });
}

function getUserByUsername(username, genfors) {
  return User.findOne({ onlinewebId: username, genfors });
}

function getAnonymousUser(passwordHash, username, genfors) {
  return AnonymousUser.findOne({
    passwordHash: hashWithSalt(passwordHash, username),
    genfors,
  });
}

function getUsers(genfors, anonymous) {
  if (anonymous) {
    return AnonymousUser.find({ genfors });
  }
  return User.find({ genfors });
}

function updateUserById(id, updatedFields, opts) {
  return User.findByIdAndUpdate(id, updatedFields, opts);
}

function addUser(user) {
  new User(user).save();
}

async function addAnonymousUser(username, passwordHash) {
  return new AnonymousUser({
    genfors,
    passwordHash: hashWithSalt(passwordHash, username),
  }).save();
}

module.exports = {
  addUser,
  addAnonymousUser,
  getAnonymousUser,
  getUsers,
  getUserById,
  getUserByUsername,
  getQualifiedUsers,
  updateUserById,
};
