/*
Written by: Thomas M
If any problems, please install and add mongoose to package.json file
*/

const mongoose = require('mongoose');
const logger = require('./logging');

const Schema = mongoose.Schema;

// Connectiong to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Could not connect to database.', { err });
});

// Creating all the Schemas
const UserSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
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

const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  option: { type: Number, required: true },
});

// Just so we can set more later, not really nessecary, but why not!
// It makes it easy if 6/9 is needed for the question to be accepted
const VoteDemandSchema = new Schema({
  title: { type: String, required: true },
  percent: { type: Number, required: true },
});

const QuestionSchema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  options: [{
    description: { type: String, required: true },
    id: { type: Number, required: true } }],
  secret: { type: Boolean, default: false },
  showOnlyWinner: { type: Boolean, default: true },
  countingBlankVotes: { type: Boolean, default: true },
  voteDemand: { type: Schema.Types.ObjectId, required: true },
  qualifiedVoters: Number,
  currentVotes: { type: Number, default: 0 },
  result: Boolean,
});


const GenforsSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'open' }, // Open/Closed/Whatever
  pin: { type: Number, required: true, default: parseInt(Math.random() * 10000, 10) },
  password: { type: String, required: true },
});


// Generating the models
const User = mongoose.model('User', UserSchema);
const AnonymousUser = mongoose.model('AnonymousUser', AnonymousUserSchema);
const Vote = mongoose.model('Vote', VoteSchema);
const Question = mongoose.model('Question', QuestionSchema);
const VoteDemand = mongoose.model('VoteDemand', VoteDemandSchema);
const Genfors = mongoose.model('Genfors', GenforsSchema);

module.exports = {
  User,
  AnonymousUser,
  Vote,
  Question,
  VoteDemand,
  Genfors,
};
