const { addIssue } = require('../models/issue.accessors');
const { createGenfors } = require('../models/meeting.accessors');
const { addUser, addAnonymousUser } = require('../models/user.accessors');
const { createVote } = require('../models/vote.accessors');

const { VOTING_NOT_STARTED } = require('../../common/actionTypes/issues');

async function generateMeeting(data) {
  const meeting = Object.assign({}, {
    title: 'title',
    date: new Date(2010, 1, 1, 1, 1, 1),
    registrationOpen: false,
    status: 'open',
  }, data);
  return createGenfors(meeting);
}

async function generateIssue(data) {
  const meeting = (data && data.genfors) || await generateMeeting();
  const issue = Object.assign({}, {
    voteDemand: 'regular',
    date: new Date(2010, 1, 1, 0, 0, 0),
    description: 'question',
    meetingId: meeting.id,
    status: VOTING_NOT_STARTED,
    active: true,
    deleted: false,
    secret: false,
    showOnlyWinner: false,
    countingBlankVotes: false,
  }, data);
  return addIssue(issue);
}

async function generateUser(data) {
  const user = Object.assign({}, {
    onlinewebId: 'test',
    name: 'test user',
  }, data);
  return addUser(user);
}

async function generateAnonymousUser(data) {
  const user = Object.assign({}, {
    passwordHash: '123',
  }, data);
  return addAnonymousUser(user);
}

async function generateVote(data) {
  const issue = data.question || await generateIssue({ alternatives: [{ text: 'one' }] });
  const user = data.user || await generateUser();
  const alternative = issue.alternatives[0]._id;
  // const vote = Object.assign({}, {
  //   question: issue._id,
  //   user: user._id,
  //   alternative: issue.alternatives[0]._id,
  // }, data);
  // @ToDo: Move this .save() into createVote
  return createVote(user, issue, alternative).save();
}

module.exports = {
  generateIssue,
  generateMeeting,
  generateUser,
  generateAnonymousUser,
  generateVote,
};
