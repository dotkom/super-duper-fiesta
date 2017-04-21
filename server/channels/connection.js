const emit = require('../utils').emit;
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getActiveQuestion = require('../models/issue').getActiveQuestion;
const getQuestions = require('../models/issue').getQuestions;
const getVotes = require('../models/vote').getVotes;
const generatePublicVote = require('../models/vote').generatePublicVote;
const haveIVoted = require('../models/vote').haveIVoted;

const { CLOSE_ISSUE, OPEN_ISSUE } = require('../../common/actionTypes/issues');
const { OPEN_MEETING } = require('../../common/actionTypes/meeting');
const {
  AUTH_REGISTERED,
  AUTH_SIGNED_IN,
  AUTH_SIGNED_OUT,
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

const connection = (socket) => {
  const loggedIn = socket.request.user.logged_in;
  if (loggedIn) {
    const user = socket.request.user;
    emit(socket, AUTH_SIGNED_IN, {
      username: user.onlinewebId,
      full_name: user.name,
      logged_in: user.logged_in,
      id: user._id, // eslint-disable-line no-underscore-dangle
    });
  } else {
    emit(socket, AUTH_SIGNED_OUT, {});
  }
  const completedRegistration = socket.request.user.completedRegistration;
  if (completedRegistration) {
    emit(socket, AUTH_REGISTERED, {});
  }
  getActiveGenfors().then((meeting) => {
    if (!meeting) {
      emit(socket, OPEN_MEETING, { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
    } else {
      emit(socket, OPEN_MEETING, meeting);
      getActiveQuestion(meeting._id).then((issue) => { // eslint-disable-line no-underscore-dangle
        if (issue === null) {
          emitNoActiveIssue(socket);
        } else {
          logger.debug('Current issue', { issue: issue.description });
          emit(socket, OPEN_ISSUE, issue);
          emit(socket, ENABLE_VOTING);

          // Issue is active, let's emit already given votes.
          getVotes(issue)
          .then((votes) => {
            votes.forEach(async (vote) => {
              emit(socket, SEND_VOTE, await generatePublicVote(issue, vote));
            });
          })
          .catch((err) => {
            logger.error('Fetching stored votes failed for issue', err, { issue });
          });

          // Emit voted state if user has voted.
          haveIVoted(issue, socket.request.user)
          .then((voted) => {
            emit(socket, VOTING_STATE, { voted });
          }).catch((err) => {
            logger.error('Something went wrong when checking for vote status', err);
          });
        }
      }).catch((err) => {
        logger.error('Getting currently active issue failed.', err);
        emitNoActiveIssue(socket);
      });
      // Fill backlog of old issues too
      getQuestions(meeting).then((issues) => {
        issues.forEach((issue) => {
          emit(socket, CLOSE_ISSUE, issue);
          // Get votes for backlogged issues
          getVotes(issue).then((votes) => {
            votes.forEach((vote) => {
              emit(socket, SEND_VOTE, vote);
            });
          }).catch((err) => {
            // eslint-disable-next-line no-underscore-dangle
            logger.error('Getting votes for issue failed', err, { issueId: issue._id });
          });
        });
      }).catch((err) => {
        logger.error('Getting issue backlog failed', err);
      });
    }
  }).catch((err) => {
    logger.error('Something went wrong when fetching active genfors.', err);
    emit(socket, 'issue', {}, {
      error: 'Noe gikk galt. Vennligst prøv igjen.',
    });
  });
};

module.exports = connection;
