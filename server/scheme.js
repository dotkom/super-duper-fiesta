/*
Written by: Thomas M
If any problems, please install and add mongoose to package.json file
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('./logging');

// Connectiong to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('Could not connect to database.', { err });
});

// Creating all the Schemas
const User_schema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  onlineweb_id: { type: String, required: true },
  register_date: { type: Date, required: true },
  can_vote: { type: Boolean, required: true },
  notes: String,
  permissions: Number,
});

const Anonymous_user_schema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  password_hash: { type: String, required: true },
});

const Vote_schema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  question: { type: Schema.Types.ObjectId, required: true },
  option: { type: Number, required: true },
});

const Vote_demand_schema = new Schema({// Just so we can set more later, not really nessecary, but why not! It makes it easy if 6/9 is needed for the question to be accepted
  title: { type: String, required: true },
  percent: { type: Number, required: true },
});

const Question_schema = new Schema({
  genfors: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  options: [{ description: { type: String, required: true }, id: { type: Number, required: true } }],
  secret: { type: Boolean, required: true },
  show_only_winner: { type: Boolean, required: true },
  counting_blank_votes: { type: Boolean, required: true },
  vote_demand: { type: Schema.Types.ObjectId, required: true },
  qualifiedVoters: Number,
  result: Boolean,
});


const Genfors_schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true }, // Open/Closed/Whatever
  pin: { type: Number, required: true },
  password: { type: String, required: true },
});


// Generating the models
const User = mongoose.model('User', User_schema);
const Anonymous_user = mongoose.model('Anonymous_user', Anonymous_user_schema);
const Vote = mongoose.model('Vote', Vote_schema);
const Question = mongoose.model('Question', Question_schema);
const Vote_demand = mongoose.model('Vote_demand', Vote_demand_schema);
const Genfors = mongoose.model('Genfors', Genfors_schema);

module.exports = {
  User,
  Anonymous_user,
  Vote,
  Question,
  Vote_demand,
  Genfors,
};
