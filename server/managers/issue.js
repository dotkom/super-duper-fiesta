const model = require('../models/issue');
const logger = require('../logging');
const { getQualifiedUsers } = require('../models/user');
const { getActiveGenfors } = require('../models/meeting');
const { getVotes } = require('../models/vote');
const { canEdit } = require('./meeting');

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

const countVoteAlternatives = (alternatives, votes) => {
  const voteObjects = Object.keys(votes).map(key => votes[key]);

  // Count votes for each alternative
  return alternatives.map(alternative => (
    voteObjects.filter(vote => vote.alternative.toString() === alternative.id).length
  ));
};

// Maps over alternatives to see if any of them got majority vote
const calculateWinner = (issue, votes, alternativeVoteCounts) => {
  const { alternatives } = issue;
  const voteDemand = RESOLUTION_TYPES[issue.voteDemand].voteDemand;
  const numTotalVotes = Object.keys(votes).length;

  let countingTotalVotes = numTotalVotes;
  const { countingBlankVotes } = issue;
  const blankAlternative = alternatives.find(alternative => alternative.text === 'Blank');
  const blankIdx = alternatives.indexOf(blankAlternative);
  // Subtract blank votes if they don't count
  if (!countingBlankVotes) {
    countingTotalVotes -= alternativeVoteCounts[blankIdx];
  }

  // Check if any alternative meets the vote demand
  const winnerVoteCount = alternativeVoteCounts.find((alternativeVoteCount, idx) => {
    // Skip blank vote
    if (idx === blankIdx) {
      return false;
    }
    return alternativeVoteCount / countingTotalVotes > voteDemand;
  });
  if (winnerVoteCount === undefined) {
    return null;
  }
  // Find alternative id
  return alternatives[alternativeVoteCounts.indexOf(winnerVoteCount)].id;
};

const voteArrayToObject = (voteCounts, alternatives) => (
  voteCounts.reduce((voteCountObject, voteCount, index) => ({
    ...voteCountObject,
    [alternatives[index].id]: voteCount,
  }), {})
);


async function getPublicIssueWithVotes(issue, admin = false) {
  let votes;
  try {
    votes = await (await getVotes(issue))
    .reduce(async (existingVotes, nextVote) => {
      const vote = await nextVote;
      return {
        ...(await existingVotes),
        [vote._id]: vote,
      };
    }, {});
  } catch (err) {
    // eslint-disable-next-line no-underscore-dangle
    logger.error('Getting votes for issue failed', err, { issueId: issue._id });
  }
  const muhVotes = await votes;

  const issueVotes = await muhVotes;
  const voteCounts = countVoteAlternatives(issue.alternatives, issueVotes);
  const voteData = {
    ...issue.toObject(),
    votes: (issue.showOnlyWinner && !admin) ? {} : voteArrayToObject(voteCounts, issue.alternatives),
    winner: calculateWinner(issue, issueVotes, voteCounts),
  };
  return voteData;
}

module.exports = {
  endIssue,
  addIssue,
  deleteIssue,
  getPublicIssueWithVotes,
};
