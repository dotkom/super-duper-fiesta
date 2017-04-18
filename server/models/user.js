const mongoose = require('mongoose');
const logger = require('../logging');
const SHA256 = require('crypto-js/sha256');
const getActiveGenfors = require('./meeting').getActiveGenfors;
const canEdit = require('./meeting').canEdit;

const permissionLevel = require('./permissions');

function hashWithSalt(password, salt) {
  return SHA256(password + salt).toString();
}

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

function addUser(name, onlinewebId, securityLevel) {
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

      user.save().then((createdUser) => {
        logger.debug('Created user', user.name);
        resolve(createdUser);
      }).catch((err) => {
        logger.error('Failed to create user', err);
        reject(err);
      });
      return null;
    }).catch(reject);
  });
}

async function addAnonymousUser(username, passwordHash) {
  const genfors = await getActiveGenfors();
  const user = await getUserByUsername(username, genfors);
  if (user.completedRegistration) {
    throw new Error('User is already registered');
  }
  const existingUser = await getAnonymousUser(passwordHash, username, genfors);
  if (existingUser) {
    throw new Error('Anonymous user aleady exists');
  }
  const anonymousUser = new AnonymousUser({
    genfors,
    passwordHash: hashWithSalt(passwordHash, username),
  });
  await anonymousUser.save();
  // eslint-disable-next-line no-underscore-dangle
  await updateUserById(user._id, { completedRegistration: true });
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
      logger.debug('Setting genfors on User', { user });
      User.findByIdAndUpdate(user, { genfors }).then(() => {
        logger.debug('Setting genfors on AnonymousUser', { anonymousUser });
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
  addAnonymousUser,
  getAnonymousUser,
  getUsers,
  getUserById,
  getUserByUsername,
  getQualifiedUsers,
  setNote,
  setCanVote,
  setGenfors,
  updateUserById,
};
