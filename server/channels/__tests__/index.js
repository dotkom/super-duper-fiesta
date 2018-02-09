jest.mock('express-session');
jest.mock('socket.io');
jest.mock('passport.socketio');
jest.mock('../connection');
jest.mock('../connection');
jest.mock('../auth');
jest.mock('../issue');
jest.mock('../admin/authAdmin');
jest.mock('../admin/meeting');
jest.mock('../admin/user/toggle_vote');
jest.mock('../vote');
const { listen } = require('../');
const connection = require('../connection');
const { listener: authListener } = require('../auth');
const { listener: issueListener } = require('../issue');
const { listener: adminAuthListener } = require('../admin/authAdmin');
const { listener: meetingListener } = require('../admin/meeting');
const { listener: toggleCanVoteListener } = require('../admin/user/toggle_vote');
const { listener: voteListener } = require('../vote');
const socketio = require('socket.io');
const { generateManager, generateUser } = require('../../utils/generateTestData');

const socketIOListener = () => (
  new Promise((resolve) => {
    socketio.mockImplementation(() => ({
      on: (action, callback) => {
        resolve(callback);
      },
      use: () => jest.fn(),
    }));
    listen(jest.fn(), {
      once: jest.fn(),
    });
  })
);

describe('channel listen user', () => {
  let socketMock;

  beforeEach(async () => {
    socketMock = {
      request: {
        user: async () => generateUser(),
      },
      join: jest.fn(),
    };
    const listenerCallback = await socketIOListener();
    await listenerCallback(socketMock);
  });

  it.skip('calls connection', () => {
    expect(connection).toBeCalled();
  });

  it.skip('calls authListener', () => {
    expect(authListener).toBeCalled();
  });

  it.skip('calls voteListener', () => {
    expect(voteListener).toBeCalled();
  });

  it.skip('calls adminAuthListener', () => {
    expect(adminAuthListener).toBeCalled();
  });

  it.skip('does not call issueListener', () => {
    expect(issueListener).not.toBeCalled();
  });

  it.skip('does not call toggleCanVoteListener', () => {
    expect(toggleCanVoteListener).not.toBeCalled();
  });

  it.skip('does not call meetingListener', () => {
    expect(meetingListener).not.toBeCalled();
  });

  it.skip('does not join the admin socket channel', async () => {
    expect(socketMock.join).not.toBeCalled();
  });
});

describe('channel listen manager', () => {
  let socketMock;

  beforeEach(async () => {
    socketMock = {
      request: {
        user: async () => generateManager(),
      },
      join: jest.fn(),
    };
    const listenerCallback = await socketIOListener();
    await listenerCallback(socketMock);
  });

  it.skip('calls connection', () => {
    expect(connection).toBeCalled();
  });

  it.skip('calls authListener', () => {
    expect(authListener).toBeCalled();
  });

  it.skip('calls voteListener', () => {
    expect(voteListener).toBeCalled();
  });

  it.skip('calls adminAuthListener', () => {
    expect(adminAuthListener).toBeCalled();
  });

  it.skip('calls issueListener', () => {
    expect(issueListener).toBeCalled();
  });

  it.skip('calls toggleCanVoteListener', () => {
    expect(toggleCanVoteListener).toBeCalled();
  });

  it.skip('calls meetingListener', () => {
    expect(meetingListener).toBeCalled();
  });

  it.skip('joins the admin socket channel', async () => {
    expect(socketMock.join).toBeCalledWith('admin');
  });
});
