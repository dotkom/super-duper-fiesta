jest.mock('../../utils');
const { emit } = require('../../utils');
const { waitForAction } = require('../socketAction');
const { EventEmitter } = require('events');

function emulateSocketResponse(socket, event, payload) {
  socket.emit(event, payload);
}

describe('waitForAction', () => {
  const REQUEST_ACTION = 'REQUEST_ACTION';
  const SEND_ACTION = 'SEND_ACTION';
  it('calls emit and returns payload', async () => {
    const socket = new EventEmitter();
    const event = 'test';
    const payload = { type: SEND_ACTION, data: 123 };

    const actionPromise = waitForAction(socket, event, REQUEST_ACTION, SEND_ACTION);
    emulateSocketResponse(socket, event, payload);

    await expect(actionPromise).resolves.toEqual(payload);
    expect(emit).toBeCalledWith(socket, REQUEST_ACTION);
  });
});
