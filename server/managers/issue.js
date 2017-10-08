const model = require('../models/issue');
const logger = require('../logging');
const { getQualifiedUsers } = require('../models/user');
const { getActiveGenfors } = require('../models/meeting');
const { canEdit } = require('./meeting');

const permissionLevel = require('../../common/auth/permissions');


function endIssue(question, user) {
  return new Promise((resolve, reject) => {
    logger.debug('Closing issue', { issue: question });
    getActiveGenfors().then((genfors) => {
      canEdit(permissionLevel.IS_MANAGER, user, genfors).then((result) => {
        if (result === true) {
          return model.endIssue(question).then(resolve).catch(reject);
        }
        reject(new Error('permission denied'));
        return null;
      }).catch(reject);
    }).catch(reject);
  });
}


function addIssue(issueData, closeCurrentIssue) {
  return new Promise((resolve, reject) => {
    logger.debug('Creating issue', issueData);
    getActiveGenfors().then((genfors) => {
      if (!genfors) reject(new Error('No genfors active'));
      model.getActiveQuestion(genfors)
      .catch((err) => {
        logger.error('Something went wrong while getting active questions', err);
      }).then((_issue) => {
        if (_issue && _issue.active && !closeCurrentIssue) {
          reject("There's already an active question");
          return null;
        } else if (_issue && !_issue.active && closeCurrentIssue) {
          logger.warn("There's already an active issue. Closing it and proceeding", {
            issue: _issue.description,
            // user: user,
            closeCurrentIssue,
          });
          model.endIssue(_issue);
        }
        // removed possible issues and proceeding to create a new one
        getQualifiedUsers(genfors).then((users) => {
          const issue = Object.assign(issueData, {
            genfors,
            qualifiedVoters: users.length,
            currentVotes: 0,
          });
          logger.debug('Created issue', { issue });
          
          // @ToDo: Create alternatives, map it to issue obj, then create issue.
          return model.addIssue(issue).then(resolve).catch(reject);
        }).catch(reject);
        return null;
      });
    }).catch(reject);
  });
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
