const Sequelize = require('sequelize');
const db = require('./postgresql');
const { hashWithSalt } = require('../utils/crypto');
const permissionLevel = require('../../common/auth/permissions');

const AnonymousUser = db.sequelize.models.anonymoususer;
const User = db.sequelize.models.user;

const Op = Sequelize.Op;

function getQualifiedUsers(meeting) {
  const meetingId = meeting.id || meeting;
  return User.findAll({ where: {
    meetingId, canVote: true, permissions: { [Op.gte]: permissionLevel.CAN_VOTE },
  } });
}

function getUserById(userId, anonymous) {
  if (anonymous) {
    return AnonymousUser.findOne({ where: { id: userId } });
  }
  return User.findOne({ where: { id: userId } });
}

function getUserByUsername(username, meeting) {
  const meetingId = meeting.id || meeting;
  return User.findOne({ where: { meetingId, onlinewebId: username } });
}

function getAnonymousUser(passwordHash, username, meeting) {
  const meetingId = (meeting && meeting.id) || meeting;
  return AnonymousUser.findOne({ where: {
    passwordHash: hashWithSalt(passwordHash, username),
    meetingId,
  },
  });
}

function getUsers(meeting, anonymous) {
  const meetingId = meeting.id || meeting;
  if (anonymous) {
    return AnonymousUser.findAll({ where: { meetingId } });
  }
  return User.findAll({ where: { meetingId } });
}

async function updateUserById(userOrId, updatedFields) {
  const id = (userOrId && userOrId.id) || userOrId;
  const user = await User.findOne({ where: { id } });
  return Object.assign(user, updatedFields).save();
}

function addUser(user) {
  return User.create(user);
}

async function addAnonymousUser(anonymousUser) {
  return AnonymousUser.create(anonymousUser);
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
