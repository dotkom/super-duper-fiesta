const logger = require('../logging');

require('../models/essentials');

const Issue = require('../models/issue');
const Meeting = require('../models/meeting');
const User = require('../models/user');
const Vote = require('../models/vote');


// we're connected!
logger.info('connected and starting tests');

const go = () => {
  logger.debug('GO');
  User.addUser('Super User', 'oidso', 'passapsaps', 3).then((object) => {
    logger.debug('added user', { user: object.user.name, auser: object.anonymousUser.passwordHash });
    Meeting.addGenfors('Wioioioiooo', new Date(), 'passhash', object.user).then((genfors) => {
      logger.debug(genfors.title);
    });
  });
};

Meeting.getActiveGenfors().then((genfors) => {
  if (genfors) {
    logger.debug('Genfors is active, creating user to remove it', genfors.title);
    User.addUser('Delete Me', 'oid', 'hahahah', 3).then((object) => {
      logger.debug('added user', { name: object.user.name });
      Meeting.endGenfors(genfors, object.user).then(go);
    });
  } else {
    go();
  }
});
/*
function go() {
  logger.info('adding genfors');
  getActiveGenfors().then((genfors) => {
    logger.log('dsa', genfors);
    addGenfors('Wioioioioio', new Date(), 'passwordHash');
  });
  const loop = () => {
    getActiveGenfors().then((genfors) => {
      if (genfors) {
        logger.info('genfors is right');
        addUser('Lol Lolsen', 'onlineweb_id1', 'hashash', 3).then((obj) => {
          logger.info(obj.user.name);
        });

/*        getUsers(genfors, false, (users) => {
          logger.info(users === user);
        });
        getUsers(genfors, true, (users) => {
          logger.info(users === auser);
        });

        addVoteDemands('Noe fint', (3 / 4), (voteDemand) => {
          addQuestion('Verdens beste spørsmål', [{ description: 'Yes!', id: 0 },
          { description: 'Pizzzza', id: 1 }, { description: 'No!', id: 2 }], false, false, false, voteDemand, (question) => {
            logger.info(question);
            addVote(question, user, 0, (vote) => {
              logger.info(vote);

              endGenfors(genfors, () => {
                getActiveGenfors((genfors2) => {
                  logger.info(genfors2 == null);
                });
              });
            });
          });
        });
      } else {
        logger.info('loooooop');
        loop();
      }
    });
  };

  loop();
}


logger.info('Getting active genfors');
getActiveGenfors().then((genfors) => {
  if (genfors) {
    logger.info('stopping genfors');
    addUser('Temp deleter', 'onlineweb_id1', 'hashash', 3).then((obj) => {
      logger.info(obj.user.name);
      endGenfors(genfors, obj.user).then(() => {
        getActiveGenfors().then((genforsNew) => {
          logger.info(genforsNew.status);
          go();
        });
      });
    });

    return;
  }
  go();
});
*/

// addUser('hakon', 'sklirg', '1234abcd').then((d) => {
//   logger.info('creted', Object.keys(d), d)
// }).catch((err) => {
//   logger.info(err)
// })
