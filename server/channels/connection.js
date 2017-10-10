const emit = require('../utils').emit;
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getActiveQuestion = require('../models/issue').getActiveQuestion;
const getQuestions = require('../models/issue').getQuestions;
const getVotes = require('../models/vote').getVotes;
const { generatePublicVote } = require('../managers/vote');
const haveIVoted = require('../models/vote').haveIVoted;
const { getAnonymousUser } = require('../models/user');
const { validatePasswordHash } = require('../managers/user');

const { AUTH_ERROR } = require('../../common/actionTypes/error');
const { VERSION } = require('../../common/actionTypes/version');
const { CLOSE_ISSUE, OPEN_ISSUE } = require('../../common/actionTypes/issues');
const { OPEN_MEETING } = require('../../common/actionTypes/meeting');
const {
  AUTH_SIGNED_IN,
  AUTH_SIGNED_OUT,
  AUTH_REGISTERED,
} = require('../../common/actionTypes/auth');
const {
  RECEIVE_VOTE: SEND_VOTE,
  ENABLE_VOTING,
  VOTING_STATE,
} = require('../../common/actionTypes/voting');

const emitNoActiveIssue = (socket) => {
  logger.debug('No active issue.');
  emit(socket, 'issue', {}, {
    action: null,
    error: null,
    message: 'Det er ingen aktive saker for øyeblikket.',
  });
};

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
      emit(socket, AUTH_ERROR, { error: 'Denne brukeren er ikke koblet til en generalforsamling. Vennligst logg ut og inn igjen.' });
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
      emitNoActiveIssue(socket);
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
    const votedState = await haveIVoted(issue, voter._id);
    if (votedState) emit(socket, VOTING_STATE, { voted: votedState });
  } catch (err) {
    logger.error('Getting currently active issue failed.', err);
    emitNoActiveIssue(socket);
  }
};

const emitIssueBacklog = async (socket, meeting) => {
  try {
    const issues = await getQuestions(meeting);
    issues.forEach(async (issue) => {
      emit(socket, CLOSE_ISSUE, issue);
      // Get votes for backlogged issues
      try {
        const votes = await getVotes(issue);
        votes.forEach(async (vote) => {
          emit(socket, SEND_VOTE, await generatePublicVote(issue, vote));
        });
      } catch (err) {
        // eslint-disable-next-line no-underscore-dangle
        logger.error('Getting votes for issue failed', err, { issueId: issue._id });
      }
    });
  } catch (err) {
    logger.error('Getting issue backlog failed', err);
  }
};

const emitGenforsData = async (socket) => {
  try {
    const meeting = await getActiveGenfors();
    if (!meeting) {
      emit(socket, OPEN_MEETING, { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
      return;
    }
    emit(socket, OPEN_MEETING, meeting);
    await emitActiveQuestion(socket, meeting);

    // Fill backlog of old issues too
    await emitIssueBacklog(socket, meeting);
  } catch (err) {
    logger.error('Something went wrong when fetching active genfors.', err);
    emit(socket, 'issue', {}, {
      error: 'Noe gikk galt. Vennligst prøv igjen.',
    });
  }
};

const connection = async (socket) => {
  await emitUserData(socket);
  await emitGenforsData(socket);
};

module.exports = connection;
