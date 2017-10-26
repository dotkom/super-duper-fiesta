const { emit, emitError } = require('../utils');
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getActiveQuestion = require('../models/issue').getActiveQuestion;
const { getConcludedIssues } = require('../models/issue');
const { getUserVote, getVotes } = require('../models/vote');
const { generatePublicVote } = require('../managers/vote');
const { getAnonymousUser } = require('../models/user');
const { validatePasswordHash } = require('../managers/user');
const { getPublicIssueWithVotes } = require('../managers/issue');

const { VERSION } = require('../../common/actionTypes/version');
const { CLOSE_ISSUE, OPEN_ISSUE } = require('../../common/actionTypes/issues');
const { OPEN_MEETING } = require('../../common/actionTypes/meeting');
const { userIsAdmin } = require('../../common/auth/permissions');
const {
  AUTH_SIGNED_IN,
  AUTH_SIGNED_OUT,
  AUTH_REGISTERED,
} = require('../../common/actionTypes/auth');
const {
  RECEIVE_VOTE: SEND_VOTE,
  ENABLE_VOTING,
  USER_VOTE,
} = require('../../common/actionTypes/voting');

// eslint-disable-next-line global-require
const APP_VERSION = require('child_process').execSync('git rev-parse HEAD').toString().trim();

const emitUserData = async (socket) => {
  emit(socket, VERSION, { version: APP_VERSION });
  const loggedIn = socket.request.user.logged_in;
  if (loggedIn) {
    const user = socket.request.user;
    emit(socket, AUTH_SIGNED_IN, {
      username: user.onlinewebId,
      full_name: user.name,
      logged_in: user.logged_in,
      id: user._id, // eslint-disable-line no-underscore-dangle
      permissions: user.permissions,
    });

    if (!user.genfors) {
      emitError(socket, new Error('Denne brukeren er ikke koblet til en generalforsamling. Vennligst logg ut og inn igjen.'));
    }

    let validPasswordHash = false;
    try {
      const { passwordHash } = socket.request.headers.cookie;
      validPasswordHash = await validatePasswordHash(user, passwordHash);
    } catch (err) {
      logger.error('Failed to validate passwordHash', user, err);
    }
    if (user.completedRegistration && validPasswordHash) {
      emit(socket, AUTH_REGISTERED, { registered: true });
    } else {
      emit(socket, AUTH_REGISTERED, { registered: false });
    }
  } else {
    emit(socket, AUTH_SIGNED_OUT, {});
  }
};

const emitActiveQuestion = async (socket, meeting) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const issue = await getActiveQuestion(meeting._id);
    if (issue === null) {
      return;
    }
    logger.debug('Current issue', { issue: issue.description });
    emit(socket, OPEN_ISSUE, issue);
    emit(socket, ENABLE_VOTING);

    // Issue is active, let's emit already given votes.
    try {
      const votes = await getVotes(issue);
      votes.forEach(async (vote) => {
        emit(socket, SEND_VOTE, await generatePublicVote(issue, vote));
      });
    } catch (err) {
      logger.error('Fetching stored votes failed for issue', err, { issue });
    }

    // Emit voted state if user has voted.
    let voter;
    if (issue.secret) {
      voter = await getAnonymousUser(socket.request.headers.cookie.passwordHash,
        socket.request.user.onlinewebId, meeting);
    } else {
      voter = socket.request.user;
    }
    // eslint-disable-next-line no-underscore-dangle
    const vote = await getUserVote(issue, voter._id);
    if (vote) {
      emit(socket, USER_VOTE, {
        alternativeId: vote.alternative,
        issueId: vote.question,
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
      emit(socket, CLOSE_ISSUE, await getPublicIssueWithVotes(issue, userIsAdmin(socket)));
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
    emit(socket, OPEN_MEETING, meeting);
    await emitActiveQuestion(socket, meeting);

    // Fill backlog of old issues too
    await emitIssueBacklog(socket, meeting);
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
