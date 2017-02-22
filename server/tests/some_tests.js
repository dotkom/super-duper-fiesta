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
  User.addUser('Super User', 'oidso', 'passapsaps', 1000).then((object) => {
    logger.debug('added user', { user: object.user.name, auser: object.anonymousUser.passwordHash });
    Meeting.addGenfors('Wioioioiooo', new Date(), 'passhash', object.user).then((genfors) => {
      logger.debug(genfors.title);
      User.setGenfors(object.user, object.anonymousUser, genfors).then(() => {
        logger.debug('updated user');
        Issue.addQuestion({
          genfors,
          description: 'Dette er et spørsmål',
          options: [{ text: 'Whatever' }, { text: 'Nah' }],
          voteDemand: (3 / 4),
        }).then((issue) => {
          logger.debug('Issue done', issue.description);
          Vote.addVote(issue, object.user, 0).then((vote) => {
            logger.debug('vote: ', { option: vote.option, user: vote.user, issue: vote.question });
            Vote.addVote(issue, object.user, 1).then((vote) => {
              logger.debug('vote: ', { option: vote.option, user: vote.user, issue: vote.question });
              Vote.addVote(issue, object.user, 2).then((vote) => {
                logger.debug('vote: ', { option: vote.option, user: vote.user, issue: vote.question });
              }).catch(logger.debug('outch Add Vote 3'));
            }).catch(logger.debug('outch Add Vote 2'));
          }).catch(logger.debug('outch Add Vote'));
        }).catch(logger.debug('outch Issue'));
      }).catch(logger.debug('outch Set genfors'));
    }).catch(logger.debug('outch Adding Genfors'));
  }).catch(logger.debug('outch Adding User'));
};

Meeting.getActiveGenfors().then((genfors) => {
  if (genfors) {
    logger.debug('Genfors is active, creating user to remove it', genfors.title);
    User.addUser('Delete Me', 'oid', 'hahahah', 100).then((object) => {
      logger.debug('added user', { name: object.user.name });
      Meeting.endGenfors(genfors, object.user).then(go).catch(logger.debug('aww'));
    }).catch(logger.debug('awwwwww'));
  } else {
    go();
  }
});
