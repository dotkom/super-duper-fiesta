const Sequelize = require('sequelize');
const db = require('./postgresql');
const { hashWithSalt } = require('../utils/crypto');
const permissionLevel = require('../../common/auth/permissions');
const { plainObject, plainObjectOrNull } = require('./utils');

const AnonymousUser = db.sequelize.models.anonymoususer;
const User = db.sequelize.models.user;

const Op = Sequelize.Op;

function getQualifiedUsers(meeting) {
  const meetingId = meeting.id || meeting;
  return User.findAll({ where: {
    meetingId, canVote: true, permissions: { [Op.gte]: permissionLevel.CAN_VOTE },
  } }).map(plainObject);
}

function getUserById(userId, anonymous) {
  let user;
  if (anonymous) {
    user = AnonymousUser.findOne({ where: { id: userId } });
  } else {
    user = User.findOne({ where: { id: userId } });
  }
  return plainObjectOrNull(user);
}

function getUserByUsername(username, meeting) {
  const meetingId = meeting.id || meeting;
  return plainObjectOrNull(User.findOne({ where: { meetingId, onlinewebId: username } }));
}

function getAnonymousUser(passwordHash, username, meeting) {
  const meetingId = (meeting && meeting.id) || meeting;
  return plainObjectOrNull(AnonymousUser.findOne({ where: {
    passwordHash: hashWithSalt(passwordHash, username),
    meetingId,
  },
  }));
}

function getUsers(meeting, anonymous) {
  const meetingId = meeting.id || meeting;
  let users;
  if (anonymous) {
    users = AnonymousUser.findAll({ where: { meetingId } });
  } else {
    users = User.findAll({ where: { meetingId } });
  }
  return users.map(plainObject);
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
