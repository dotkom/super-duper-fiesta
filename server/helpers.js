// { Anonymous_user, Genfors, Question, User, Vote, Vote_demand }
const Anonymous_user = require('./scheme').Anonymous_user;
const Genfors = require('./scheme').Genfors;
const Question = require('./scheme').Question;
const User = require('./scheme').User;
const Vote = require('./scheme').Vote;
const Vote_demand = require('./scheme').Vote_demand;

function handleError(err){
  logger.error("Error doing something", { err: err });
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

module.exports = {
  getActiveGenfors: getActiveGenfors
}
