const { addIssue } = require('../models/issue.accessors');
const { createGenfors } = require('../models/meeting.accessors');
const { addUser, addAnonymousUser } = require('../models/user.accessors');
const { createVote } = require('../models/vote.accessors');
const { addAlternative } = require('../models/alternative.accessors');

const { VOTING_NOT_STARTED } = require('../../common/actionTypes/issues');

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
  const meeting = (data && data.meeting) || await generateMeeting();
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
  const meeting = (data && data.meeting) || await generateMeeting();
  const user = Object.assign({}, {
    onlinewebId: 'test',
    name: 'test user',
    registerDate: new Date(2010, 1, 1, 0, 0, 0),
    canVote: false,
    notes: '',
    permissions: 0,
    completedRegistration: false,
    meetingId: meeting.id,
  }, data);
  return addUser(user);
}

async function generateAnonymousUser(data) {
  const meeting = (data && data.meeting) || await generateMeeting();
  const user = Object.assign({}, {
    passwordHash: '123',
    meetingId: meeting.id,
  }, data);
  return addAnonymousUser(user);
}

async function generateAlternative(data) {
  const issue = await generateIssue();
  const alternative = Object.assign({}, {
    text: 'default alternative',
    issueId: (data && data.issueId) || issue.id,
  }, data);
  return addAlternative(alternative);
}

async function generateVote(data) {
  const issue = (data && data.question) || await generateIssue();
  const alternative = (data && data.alternative) || await addAlternative({
    issueId: issue.id,
  });
  const user = (data && data.user) || await generateUser();
  return createVote(user, issue, alternative);
}

module.exports = {
  generateAlternative,
  generateIssue,
  generateMeeting,
  generateUser,
  generateAnonymousUser,
  generateVote,
};
