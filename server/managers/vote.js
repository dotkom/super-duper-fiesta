const logger = require('../logging');
const { canEdit } = require('../managers/meeting');
const permissionLevel = require('../../common/auth/permissions');
const { getIssueById } = require('../models/issue');
const { haveIVoted, createVote } = require('../models/vote');

async function addVote(issueId, user, alternative, voter) {
  let issue;
  try {
    issue = await getIssueById(issueId);
  } catch (err) {
    logger.error('Retrieving issue for vote failed!', err, { issueId });
    throw new Error('Noe gikk galt. Vennligst prøv igjen.');
  }
  logger.debug('Storing vote.', { issueId, user: user.onlinewebId });
  if (!issue.active) {
    logger.warn('Tried to vote on inactive issue!', { issueId, user: user.onlinewebId });
    throw new Error('Saken du stemte på er ikke lenger aktiv');
  }
  if (!user.canVote) {
    logger.warn('Tried to vote without the right to vote!', { issueId, user: user.onlinewebId });
    throw new Error('Du har ikke stemmerett');
  }
  logger.silly('Checking permissions.', { issueId, user: user.onlinewebId });
  try {
    await canEdit(permissionLevel.CAN_VOTE, user, issue.genfors);
    const alreadyVoted = await haveIVoted(issueId, voter);
    if (!alreadyVoted) {
      const vote = createVote(voter, issueId, alternative);
      logger.debug('Storing vote.', { issueId, user: user.onlinewebId, voter });
      return vote.save();
    }
    logger.debug('User has already voted!', { issueId, user: user.onlinewebId, voter });
    throw new Error('Du har allerede stemt.');
  } catch (err) {
    logger.warn('User tried to vote without having appropriate permissions.', {
      issueId,
      user: user.onlinewebId,
      requiredPerms: permissionLevel.CAN_VOTE,
      hadPerms: user.permissions,
    });
    throw err;
  }
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
