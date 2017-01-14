/*
Written by: Thomas M
If any problems, please install and add mongoose to package.json file
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const logger = require('./logging');

//Connectiong to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

var db = mongoose.connection;
db.on('error', err => {
  logger.error('Could not connect to database.', err)
});

//Creating all the Schemas
var User_schema = new Schema({
  genfors: {type: Schema.Types.ObjectId, required: true},
  name: {type: String, required: true},
  onlineweb_id: {type: String, required: true},
  register_date: {type: Date, required: true},
  can_vote: {type: Boolean, required: true},
  notes: String,
  security: Number
});

var Anonymous_user_schema = new Schema({
  genfors: {type: Schema.Types.ObjectId, required: true},
  password_hash: {type: String, required: true},
});

var Vote_schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  question: {type: Schema.Types.ObjectId, required: true},
  option: {type: Number, required: true},
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
  options: [{description: {type: String, required: true}, id: {type: Number, required: true}}],
  secret: {type: Boolean, required: true},
  show_only_winner: {type: Boolean, required: true},
  counting_blank_votes: {type: Boolean, required: true},
  vote_demand: {type: Schema.Types.ObjectId, required: true},
  qualifiedVoters: Number,
  result: Boolean,
});


var Genfors_schema = new Schema({
  title: {type: String, required: true},
  date: {type: Date, required: true},
  status: {type: String, required: true}, //Open/Closed/Whatever
  pin: {type: Number, required: true},
  password: {type: String, required: true}
});


//Generating the models
var User = mongoose.model('User', User_schema);
var Anonymous_user = mongoose.model('Anonymous_user', Anonymous_user_schema);
var Vote = mongoose.model('Vote', Vote_schema);
var Question = mongoose.model('Question', Question_schema);
var Vote_demand = mongoose.model('Vote_demand', Vote_demand_schema);
var Genfors = mongoose.model('Genfors', Genfors_schema);


function handleError(err){
  logger.error("Error doing something", err);
}




function addGenfors(title, date, passwordHash, cb){
  //Only allow one at a time
  getActiveGenfors(function(genfors){

    //@TODO Prompt user for confirmations and disable active genfors

    if(genfors) return handleError("You can't add a new because there is one active");

    //Add a new genfors
    var genfors = new Genfors({
      title: title,
      date: date,
      status: "Open",
      pin: parseInt(Math.random()*10000),
      password: passwordHash
    });
    genfors.save(function(err){
      if(err) return handleError(err);
      cb(genfors);
    });
  });
}

function addUser(name, onlineweb_id, password_hash, cb){
  getActiveGenfors(function(genfors){
    if(!genfors) return handleError("No active genfors");
    var user = new User({
      genfors: genfors,
      name: name,
      onlineweb_id: onlineweb_id,
      register_date: new Date(),
      can_vote: false,
      notes: "",
      security: 0
    });

    var anonymousUser = new Anonymous_user({
      genfors: genfors,
      password_hash: password_hash,
    });

    user.save(function(err){
      if(err) return handleError(err);
      anonymousUser.save(function(err){
        if(err) return handleError(err);
        cb(user, anonymousUser);
      });
    });
  });
}


function addVoteDemands(title, percent, cb){
  var voteDemand = new Vote_demand({
    title: title,
    percent: percent
  });

  voteDemand.save(function(err){
    if(err) return handleError(err);
    cb(voteDemand);
  })
}


function addQuestion(description, options, secret, show_only_winner, counting_blank_votes, vote_demand, cb){
  getActiveGenfors(function(genfors){
    if(!genfors) return handleError("No genfors active");

    getQualifiedUsers(genfors, secret, function(users){
      var question = new Question({
        genfors: genfors,
        description: description,
        active: true,
        deleted: false,
        options: options,//Format {description, id}
        secret: secret,
        show_only_winner: show_only_winner,
        counting_blank_votes: counting_blank_votes,
        vote_demand: vote_demand,
        qualifiedVoters: users.length
      });

      question.save(function(err){
        if(err) return handleError(err);
        cb(question);
      });
    });

  });
}

function addVote(question, user, option, cb){
  Question.findOne({_id: question}, function(err, question){
    if(err || !question.active) return handleError(err || "Not an active question");
    
    var vote = new Vote({
      user: user,
      question: question,
      option: option,
    });
    vote.save(function (err){
      if(err) return handleError(err);
      cb(vote);
    });
  });
}

//Update functions
//TODO Unable activity if genfors is ended
function endGenfors(genfors, cb){
  Genfors.update({_id: genfors}, {status: "Closed"}, cb);
}
function endQuestion(question, cb){
  Genfors.update({_id: question}, {active: false}, cb);
}



//Get requests
function getActiveGenfors(cb){
  Genfors.findOne({status: "Open"}).exec(function(err, genfors){
    if(err) return handleError(err);

    cb(genfors);
  });
}

function getUsers(genfors, anonymous, cb){
  if(anonymous){
    Anonymous_user.find({genfors: genfors}, function(err, users){
      if(err) return handleError(err);
      cb(users);
    });
  }else{
    User.find({genfors: genfors}, function(err, users){
      if(err) return handleError(err);
      cb(users);
    });
  }
}

function getQualifiedUsers(genfors, secret, cb){
  if(secret){
    return Anonymous_user.find({genfors: genfors, can_vote: true}, function(err, users){
      if(err) return handleError(err);
      cb(users);
    });
  }else{
    return User.find({genfors: genfors, can_vote: true}, function(err, users){
      if(err) return handleError(err);
      cb(users);
    });
  }
}



//Testing
db.once('open', function() {
  // we're connected!
  console.log("Connected");


  getActiveGenfors(function(genfors){
    if(genfors){
      endGenfors(genfors, function(){
        go();
      });
    }else{
      go();
    }
  });

  function go(){
    addGenfors('Wioioioioio', new Date(), "passwordHash", function(genfors){
      console.log(genfors);

      getActiveGenfors(function(genfors){
        console.log(genfors);
      });

      addUser('Lol Lolsen', 'onlineweb_id1', 'hashash', function(user, auser){
        console.log(user);
        console.log(auser);
        getUsers(genfors, false, function(users){
          console.log(users);
        });
        getUsers(genfors, true, function(users){
          console.log(users);
        });

        addVoteDemands("Noe fint", 3/4, function(vote_demand){
          addQuestion("Verdens beste spørsmål", [{description: "Yes!", id: 0}, {description: "Pizzzza", id: 1}, {description: "No!", id: 2}], false, false, false, vote_demand, function(question){
            console.log(question);
            addVote(question, user, 0, function(vote){
              console.log(vote);

              endGenfors(genfors, function(err){
                if(err) handleError(err);
                console.log("Ended");
                getActiveGenfors(function(genfors){
                  console.log(genfors);
                });
              });
            });
          });
        });
      });
    });
  }

});

module.exports = {
  User: User,
  Anonymous_user: Anonymous_user,
  Vote: Vote,
  Question: Question,
  Vote_demand: Vote_demand,
  Genfors: Genfors,
  getActiveGenfors: getActiveGenfors,
}
