const model = require('../models/issue');
const logger = require('../logging');
const { getQualifiedUsers } = require('../models/user');
const { getActiveGenfors } = require('../models/meeting');
const { canEdit } = require('./meeting');

const permissionLevel = require('../../common/auth/permissions');


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

module.exports = {
  endIssue,
  addIssue,
  deleteIssue,
};
