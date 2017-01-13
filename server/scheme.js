/*
Written by: Thomas M
If any problems, please install and add mongoose to package.json file
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  genfors: Schema.Types.ObjectId,
  name: String,
  password_hash: String,
  onlineweb_id: Number,
  registerd: Date,
  can_vote: Boolean
});

var Answer = new Schema({
  question: Schema.Types.ObjectId,
  option: Number,
  name: String,
  user: Schema.Types.ObjectId
});

var Vote_demand = new Schema({
  title: String,
  percent: Number
});

var Question = new Schema({
  genfors: Schema.Types.ObjectId,
  title:  String,
  description: String,
  active: Boolean,
  deleted: Boolean,
  options: [{description: String, id: Number, blank: Boolean}],
  secret: Boolean,
  show_only_winner: Boolean,
  counting_blank_votes: Boolean,
  vote_demand: Schema.Types.ObjectId
});


var Genfors = new Schema({
  title: String,
  date: Date,
  staus: Boolean, //Open/Closed?
  pin: Number,
});
