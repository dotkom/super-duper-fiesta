const mongoose = require('mongoose');
const logger = require('../logging');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;

const permissionLevel = require('./permissions');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: false },
  name: { type: String, required: true, unique: true },
  onlinewebId: { type: String, required: true, unique: true },
  registerDate: { type: Date, default: Date.now() },
  canVote: { type: Boolean, default: false },
  notes: String,
  permissions: { type: Number, default: 0 },
});

const AnonymousUserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: false },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const AnonymousUser = mongoose.model('AnonymousUser', AnonymousUserSchema);


function getQualifiedUsers(genfors, secret) {
  if (secret) {
    return AnonymousUser.find({ genfors, permissions: { $gt: permissionLevel.CAN_VOTE } });
  }
  return User.find({ genfors, permissions: { $gt: permissionLevel.CAN_VOTE } });
}

function getUserById(userId, anonymous) {
  if (anonymous) {
    return AnonymousUser.findOne({ _id: userId });
  }
  return User.findOne({ _id: userId });
}

function getUserByUsername(username) {
  return User.findOne({ onlinewebId: username });
}

function getUsers(genfors, anonymous) {
  if (anonymous) {
    return AnonymousUser.find({ genfors });
  }
  return User.find({ genfors });
}


function addUser(name, onlinewebId, passwordHash, securityLevel) {
  return new Promise((resolve, reject) => {
    getActiveGenfors().then((genfors) => {
      // @TODO make sure to connect all users to genfors
      if (!genfors && securityLevel < permissionLevel.IS_SUPERUSER) {
        return reject(new Error('Ingen aktive generalforsamlinger'));
      }
      if (securityLevel >= permissionLevel.IS_SUPERUSER) {
        logger.info('Creating a user with high security clearance.', {
          name, onlinewebId, securityLevel,
        });
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
          logger.debug('Created user', user.name);
          resolve({ user: p[0], anonymousUser: p[1] });
        }).catch((err) => {
          logger.error('Failed to create user', user.name);
          reject(err);
        });
      return null;
    }).catch(reject);
  });
}


function updateUserById(id, updatedFields) {
  return User.findByIdAndUpdate(id, updatedFields);
}


function setNote(user, targetUser, note) {
  return new Promise((resolve, reject) => {
    canEdit(permissionLevel.IS_MANAGER, user, targetUser.genfors, () => {
      User.findByIdAndUpdate(user, { note }).then(resolve).catch(reject);
    });
  });
}

function setGenfors(user, anonymousUser, genfors) {
  return new Promise((resolve, reject) => {
    canEdit(permissionLevel.IS_MANAGER, user, genfors).then(() => {
      logger.debug('updating user');
      User.findByIdAndUpdate(user, { genfors }).then(() => {
        logger.debug('one done, one to go');
        AnonymousUser.findByIdAndUpdate(anonymousUser, { genfors }).then(resolve).catch(reject);
      }).catch(reject);
    }).catch(reject);
  });
}

function setCanVote(user, targetUser) {
  return new Promise((resolve, reject) => {
    canEdit(permissionLevel.IS_MANAGER, user, targetUser.genfors, () => {
      User.findByIdAndUpdate(user, { permissions: permissionLevel.CAN_VOTE })
      .then(resolve).catch(reject);
    });
  });
}

module.exports = {
  addUser,
  getUsers,
  getUserById,
  getUserByUsername,
  getQualifiedUsers,
  setNote,
  setCanVote,
  setGenfors,
  updateUserById,
};
