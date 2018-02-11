const { emit } = require('../utils');

const waitForAction = (socket, event, requestAction, receiveAction) => (
  new Promise((resolve) => {
    socket.once(event, async (payload) => {
      if (payload.type === receiveAction) {
        resolve(payload);
      }
    });
    emit(socket, requestAction);
  })
);

module.exports = {
  waitForAction,
};
