const db = require('./postgresql');
const { hashWithSalt } = require('../utils/crypto');
const permissionLevel = require('../../common/auth/permissions');

const AnonymousUser = db.sequelize.models.anonymoususer;
const User = db.sequelize.models.user;


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
  return new User(user).save();
}

async function addAnonymousUser(anonymousUser) {
  return new AnonymousUser(anonymousUser).save();
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
