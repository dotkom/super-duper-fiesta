const emit = require('../utils').emit;
const logger = require('../logging');

const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getActiveQuestion = require('../models/issue').getActiveQuestion;

const connection = (socket) => {
  getActiveGenfors().then((meeting) => {
    if (!meeting) {
      emit(socket, 'OPEN_MEETING', { error: 1, code: 'no_active_meeting', message: 'Ingen aktiv generalforsamling.' });
    } else {
      emit(socket, 'OPEN_MEETING', meeting);
      getActiveQuestion(meeting._id).then((issue) => {
        logger.debug('Current issue', { issue: issue.description });
        emit(socket, 'OPEN_ISSUE', issue);
      }).catch((err) => {
        logger.error('Getting currently active issue failed.', { err });
        emit(socket, 'issue', {}, {
          action: null,
          error: null,
          message: 'Det er ingen aktive saker for øyeblikket.',
        });
      });
    }
  }).catch((err) => {
    logger.error('Something went wrong.', { err });
    emit(socket, 'issue', {}, {
      error: 'Noe gikk galt. Vennligst prøv igjen.',
    });
  });
};

module.exports = connection;
