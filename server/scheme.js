/*
Written by: Thomas M
If any problems, please install and add mongoose to package.json file
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

console.log("Connectiong to db");

//Connectiong to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log("Connected");

  //Creating all the Schemas
  var User_schema = new Schema({
    genfors: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    password_hash: {type: String, required: true},
    onlineweb_id: {type: Number, required: true},
    register_date: {type: Date, required: true},
    can_vote: {type: Boolean, required: true},
  });

  var Answer_schema = new Schema({
    question: {type: Schema.Types.ObjectId, required: true},
    option: {type: Number, required: true},
    name: String, //Not needed
    user: Schema.Types.ObjectId, // So to know who has voted but not for what we have a User_has_voted_at_question thingi
  });

  var User_has_voted_at_question = new Schema({// Who has voted at what but not for what
    User: {type: Schema.Types.ObjectId, required: true},
    Question: {type: Schema.Types.ObjectId, required: true}
  });

  var Vote_demand_schema = new Schema({// Just so we can set more later, not really nessecary, but why not! It makes it easy if 6/9 is needed for the question to be accepted
    title: {type: String, required: true},
    percent: {type: Number, required: true},
  });

  var Question_schema = new Schema({
    genfors: {type: Schema.Types.ObjectId, required: true},
    description: {type: String, required: true},
    active: {type: Boolean, required: true},
    deleted: {type: Boolean, required: true},
    options: [{description: String, id: Number, blank: Boolean}],
    secret: {type: Boolean, required: true},
    show_only_winner: {type: Boolean, required: true},
    counting_blank_votes: {type: Boolean, required: true},
    vote_demand: {type: Schema.Types.ObjectId, required: true},
  });


  var Genfors_schema = new Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    status: {type: Boolean, required: true}, //Open/Closed?
    pin: {type: Number, required: true},
  });


  //Generating the models
  var User = mongoose.model('User', User_schema);
  var Answer = mongoose.model('Answer', Answer_schema);
  var Question = mongoose.model('Question', Question_schema);
  var Vote_demand = mongoose.model('Vote_demand', Vote_demand_schema);
  var Genfors = mongoose.model('Genfors', Genfors_schema);

/*
//Testing stuff

  var genfors1984 = Genfors({
    title: "Weeeeeeeeee",
    date: new Date(),
    status: true,
    pin: 789
  });

  Genfors.remove({}, function(){});

  genfors1984.save(function(err){
    if(err) return handleError(err);


    var gens = Genfors.find();
    gens.find().exec(function(err, genfors){
      console.log(genfors);
    });

  });
*/

});
