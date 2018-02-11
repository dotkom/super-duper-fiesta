const { emit } = require('../utils');

const waitForAction = (socket, eventName, requestAction, receiveAction) => (
  new Promise((resolve) => {
    socket.once(eventName, async (payload) => {
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
