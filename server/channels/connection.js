const { emit, emitError } = require('../utils');
const { waitForAction } = require('../utils/socketAction');
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting.accessors').getActiveGenfors;
const getActiveQuestion = require('../models/issue.accessors').getActiveQuestion;
const { getConcludedIssues } = require('../models/issue.accessors');
const { getVotes } = require('../models/vote.accessors');
const { generatePublicVote, getUserVote } = require('../managers/vote');
const { getAnonymousUser, getUsers } = require('../models/user.accessors');
const { validatePasswordHash, publicUser } = require('../managers/user');
const { getPublicIssueWithVotes } = require('../managers/issue');
const { publicMeeting } = require('../managers/meeting');

const { VERSION } = require('../../common/actionTypes/version');
const { CLOSE_ISSUE, OPEN_ISSUE } = require('../../common/actionTypes/issues');
const { OPEN_MEETING } = require('../../common/actionTypes/meeting');
const { userIsAdmin } = require('../../common/auth/permissions');
const {
  AUTH_SIGNED_IN,
  AUTH_AUTHENTICATED,
  REQUEST_PASSWORD_HASH,
  SEND_PASSWORD_HASH,
} = require('../../common/actionTypes/auth');
const {
  RECEIVE_VOTE: SEND_VOTE,
  USER_VOTE,
} = require('../../common/actionTypes/voting');
const { RECEIVE_USER_LIST: USER_LIST } = require('../../common/actionTypes/users');

// eslint-disable-next-line global-require
const APP_VERSION = require('child_process').execSync('git rev-parse HEAD').toString().trim();

const emitUserData = async (socket) => {
  emit(socket, VERSION, { version: APP_VERSION });
  const user = await socket.request.user();
  emit(socket, AUTH_SIGNED_IN, {
    username: user.onlinewebId,
    full_name: user.name,
    id: user.id,
    permissions: user.permissions,
    completedRegistration: user.completedRegistration,
  });

  if (!user.meetingId) {
    emitError(socket, new Error('Denne brukeren er ikke koblet til en generalforsamling. Vennligst logg ut og inn igjen.'));
  }

  let validPasswordHash = false;
  try {
    const { passwordHash } = await waitForAction(socket, 'auth', REQUEST_PASSWORD_HASH, SEND_PASSWORD_HASH);
    validPasswordHash = await validatePasswordHash(user, passwordHash);
  } catch (err) {
    logger.error('Failed to validate passwordHash', { userId: user.id, err: err.message });
  }
  if (user.completedRegistration && validPasswordHash) {
    emit(socket, AUTH_AUTHENTICATED, { authenticated: true });
  } else {
    emit(socket, AUTH_AUTHENTICATED, { authenticated: false });
  }
};

const emitActiveQuestion = async (socket, meeting) => {
  const user = await socket.request.user();
  try {
    const issue = await getActiveQuestion(meeting.id);
    if (issue === null) {
      return;
    }
    logger.debug('Current issue', { issue: issue.description });
    emit(socket, OPEN_ISSUE, issue);

    // Issue is active, let's emit already given votes.
    try {
      const votes = await getVotes(issue.id);
      votes.forEach(async (vote) => {
        emit(socket, SEND_VOTE, await generatePublicVote(issue, vote));
      });
    } catch (err) {
      logger.error('Fetching stored votes failed for issue', err, { issue });
    }

    // Emit voted state if user has voted.
    let voter;
    if (issue.secret) {
      // TODO: Consider refactoring so that password hash is only retrieved once
      const { passwordHash } = await waitForAction(socket, 'auth', REQUEST_PASSWORD_HASH, SEND_PASSWORD_HASH);
      voter = await getAnonymousUser(passwordHash, user.onlinewebId, meeting.id);
    } else {
      voter = user;
    }
    const vote = await getUserVote(issue.id, voter.id);
    if (vote) {
      emit(socket, USER_VOTE, {
        alternativeId: vote.alternativeId,
        issueId: vote.issueId,
      });
    }
  } catch (err) {
    logger.error('Getting currently active issue failed.', err);
    emitError(socket, new Error('Noe gikk galt under henting av aktiv sak.'));
  }
};

const emitIssueBacklog = async (socket, meeting) => {
  try {
    const issues = await getConcludedIssues(meeting);
    await Promise.all(issues.map(async (issue) => {
      // Get votes for backlogged issues
      emit(
        socket,
        CLOSE_ISSUE,
        await getPublicIssueWithVotes(issue, userIsAdmin(await socket.request.user())),
      );
    }));
  } catch (err) {
    logger.error('Getting issue backlog failed', err);
  }
};

const emitGenforsData = async (socket) => {
  try {
    const meeting = await getActiveGenfors();
    if (!meeting) {
      emitError(socket, new Error('Ingen aktiv generalforsamling.'));
      return;
    }

    const isAdmin = userIsAdmin(await socket.request.user());

    const users = await getUsers(meeting.id);
    emit(socket, USER_LIST, users.map(user => publicUser(user, isAdmin)));

    emit(socket, OPEN_MEETING, publicMeeting(meeting, isAdmin));
    await emitActiveQuestion(socket, meeting);

    // Fill backlog of old issues too
    await emitIssueBacklog(socket, meeting.id);
  } catch (err) {
    logger.error('Something went wrong when fetching active genfors.', err);
    emitError(socket, new Error('Noe gikk galt. Vennligst prøv igjen.'));
  }
};

const connection = async (socket) => {
  await emitUserData(socket);
  await emitGenforsData(socket);
};

module.exports = connection;
