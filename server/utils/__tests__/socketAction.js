jest.mock('../../utils');
const { emit } = require('../../utils');
const { waitForAction } = require('../socketAction');
const { EventEmitter } = require('events');

function emulateSocketResponse(socket, eventName, payload) {
  socket.emit(eventName, payload);
}

describe('waitForAction', () => {
  const REQUEST_ACTION = 'REQUEST_ACTION';
  const SEND_ACTION = 'SEND_ACTION';
  it('calls emit and returns payload', async () => {
    const socket = new EventEmitter();
    const eventName = 'test';
    const payload = { type: SEND_ACTION, data: 123 };

    const actionPromise = waitForAction(socket, eventName, REQUEST_ACTION, SEND_ACTION);
    emulateSocketResponse(socket, eventName, payload);

    await expect(actionPromise).resolves.toEqual(payload);
    expect(emit).toBeCalledWith(socket, REQUEST_ACTION);
  });
});
