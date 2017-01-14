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
