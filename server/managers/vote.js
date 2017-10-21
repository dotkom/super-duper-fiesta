const logger = require('../logging');
const { canEdit } = require('../managers/meeting');
const permissionLevel = require('../../common/auth/permissions');
const { getIssueById } = require('../models/issue');
const { haveIVoted, createVote } = require('../models/vote');

function addVote(issueId, user, alternative, voter) {
  return new Promise((resolve, reject) => {
    getIssueById(issueId)
    .then((issue) => {
      logger.debug('Storing vote.', { issueId, user: user.onlinewebId });
      if (!issue.active) {
        logger.warn('Tried to vote on inactive issue!', { issueId, user: user.onlinewebId });
        reject();
        return;
      }
      if (!user.canVote) {
        logger.warn('Tried to vote without the right to vote!', { issueId, user: user.onlinewebId });
        reject(new Error('You do not have the right to vote'));
        return;
      }
      logger.silly('Checking permissions.', { issueId, user: user.onlinewebId });
      canEdit(permissionLevel.CAN_VOTE, user, issue.genfors).then(async () => {
        const alreadyVoted = await haveIVoted(issueId, voter);
        if (!alreadyVoted) {
          const vote = createVote(voter, issueId, alternative);
          logger.debug('Storing vote.', { issueId, user: user.onlinewebId, voter });
          vote.save().then(resolve).catch(reject);
        } else {
          logger.debug('User has already voted!', { issueId, user: user.onlinewebId, voter });
          reject(new Error('Du har allerede stemt.'));
        }
      }).catch((err) => {
        logger.warn('User tried to vote without having appropriate permissions.', {
          issueId,
          user: user.onlinewebId,
          requiredPerms: permissionLevel.CAN_VOTE,
          hadPerms: user.permissions,
        });
        reject(err);
      });
    }).catch((err) => {
      logger.error('Retrieving issue for vote failed!', err, { issueId });
    });
  });
}

const getPublicVote = (vote, secret, showOnlyWinner) => ({
  _id: vote._id, // eslint-disable-line no-underscore-dangle
  question: vote.question,
  user: (showOnlyWinner || secret) ? '' : vote.user,
  alternative: showOnlyWinner ? '' : vote.alternative,
});

const generatePublicVote = async (id, vote) => {
  let issue;
  if (typeof id === 'string') {
    issue = await getIssueById(id);
  } else issue = id;

  return getPublicVote(vote, issue.secret, issue.showOnlyWinner);
};

module.exports = {
  addVote,
  generatePublicVote,
  getPublicVote,
};
