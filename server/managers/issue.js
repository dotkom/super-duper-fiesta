const model = require('../models/issue');
const logger = require('../logging');
const { getQualifiedUsers } = require('../models/user');
const { getActiveGenfors } = require('../models/meeting');
const { getVotes } = require('../models/vote');
const { canEdit } = require('./meeting');
const { generatePublicVote } = require('./vote');

const permissionLevel = require('../../common/auth/permissions');
const { RESOLUTION_TYPES } = require('../../common/actionTypes/voting');


async function endIssue(question, user) {
  logger.debug('Closing issue', { issue: question });
  const genfors = await getActiveGenfors();
  const result = await canEdit(permissionLevel.IS_MANAGER, user, genfors);
  if (result === true) {
    return model.endIssue(question);
  }
  throw new Error('permission denied');
}

async function addIssue(issueData, closeCurrentIssue) {
  logger.debug('Creating issue', issueData);
  const genfors = await getActiveGenfors();
  if (!genfors) throw new Error('No genfors active');
  const activeIssue = model.getActiveQuestion(genfors);
  if (activeIssue && activeIssue.active && !closeCurrentIssue) {
    throw new Error("There's already an active question");
  } else if (activeIssue && !activeIssue.active && closeCurrentIssue) {
    logger.warn("There's already an active issue. Closing it and proceeding", {
      issue: activeIssue.description,
      // user: user,
      closeCurrentIssue,
    });
    await model.endIssue(activeIssue);
  }
  // removed possible issues and proceeding to create a new one
  const users = await getQualifiedUsers(genfors);
  const issue = Object.assign(issueData, {
    genfors,
    qualifiedVoters: users.length,
    currentVotes: 0,
  });
  logger.debug('Created issue', { issue });

  // @ToDo: Create alternatives, map it to issue obj, then create issue.
  return model.addIssue(issue);
}

async function deleteIssue(issue, user) {
  const genfors = await getActiveGenfors();
  const userCanEdit = await canEdit(permissionLevel.IS_MANAGER, user, genfors);
  if (userCanEdit) {
    return model.deleteIssue(issue);
  }
  return null;
}

// Maps over alternatives to see if any of them got majority vote
const calculateWinner = (issue, votes) => {
  const { options } = issue;
  const voteDemand = RESOLUTION_TYPES[issue.voteDemand].voteDemand;
  const numTotalVotes = Object.keys(votes).length;
  const voteObjects = Object.keys(votes).map(key => votes[key]);

  // Count votes for each alternative
  const optionVoteCounts = options.map(option => (
    voteObjects.filter(vote => vote.option.toString() === option.id).length
  ));

  let countingTotalVotes = numTotalVotes;
  const { countingBlankVotes } = issue;
  const blankAlternative = options.find(option => option.text === 'Blank');
  const blankIdx = options.indexOf(blankAlternative);
  // Subtract blank votes if they don't count
  if (!countingBlankVotes) {
    countingTotalVotes -= optionVoteCounts[blankIdx];
  }

  // Check if any alternative meets the vote demand
  const winnerVoteCount = optionVoteCounts.find((optionVoteCount, idx) => {
    // Skip blank vote
    if (idx === blankIdx) {
      return false;
    }
    return optionVoteCount / countingTotalVotes > voteDemand;
  });
  if (winnerVoteCount === undefined) {
    return null;
  }
  // Find alternative id
  return options[optionVoteCounts.indexOf(winnerVoteCount)].id;
};


async function getPublicIssueWithVotes(issue) {
  let votes;
  try {
    votes = await (await getVotes(issue))
    .map(async (x) => {
      try {
        return await generatePublicVote(issue._id, x);
      } catch (err) {
        logger.error('Failed generating public vote', err);
        return {};
      }
    })
    .reduce(async (existingVotes, nextVote) => {
      const vote = await nextVote;
      if (Object.keys(existingVotes).length === 0) {
        return { [vote._id]: vote };
      }
      return Object.assign({ ...existingVotes }, { [vote._id]: nextVote });
    }, {});
  } catch (err) {
    // eslint-disable-next-line no-underscore-dangle
    logger.error('Getting votes for issue failed', err, { issueId: issue._id });
  }
  const muhVotes = await votes;

  const issueVotes = await muhVotes;
  const voteData = {
    ...issue,
    votes: issue.showOnlyWinner ? null : issueVotes,
    winner: calculateWinner(issue, issueVotes),
  };
  return voteData;
}

module.exports = {
  endIssue,
  addIssue,
  deleteIssue,
  getPublicIssueWithVotes,
};
