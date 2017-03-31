const emit = require('../utils').emit;
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getActiveQuestion = require('../models/issue').getActiveQuestion;
const getVotes = require('../models/vote').getVotes;
const haveIVoted = require('../models/vote').haveIVoted;

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
    emit(socket, 'AUTH_SIGNED_IN', {
      username: user.onlinewebId,
      full_name: user.name,
      logged_in: user.logged_in,
    });
  } else {
    emit(socket, 'AUTH_SIGNED_OUT', {});
  }
  getActiveGenfors().then((meeting) => {
    if (!meeting) {
      emit(socket, 'OPEN_MEETING', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
    } else {
      emit(socket, 'OPEN_MEETING', meeting);
      getActiveQuestion(meeting._id).then((issue) => { // eslint-disable-line no-underscore-dangle
        if (issue === null) {
          emitNoActiveIssue(socket);
        } else {
          logger.debug('Current issue', { issue: issue.description });
          emit(socket, 'OPEN_ISSUE', issue);

          // Issue is active, let's emit already given votes.
          getVotes(issue)
          .then((votes) => {
            votes.forEach((vote) => {
              emit(socket, 'ADD_VOTE', vote);
            });
          })
          .catch((err) => {
            logger.error('Fetching stored votes failed for issue', err, { issue });
          });

          // Emit voted state if user has voted.
          haveIVoted(issue, socket.request.user)
          .then((voted) => {
            emit(socket, 'VOTED_STATE', { voted });
          }).catch((err) => {
            logger.error('Something went wrong when checking for vote status', err);
          });
        }
      }).catch((err) => {
        logger.error('Getting currently active issue failed.', err);
        emitNoActiveIssue(socket);
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
