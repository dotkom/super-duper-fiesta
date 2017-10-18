jest.mock('../../../../models/meeting');
jest.mock('../../../../models/user');
const { requestUserList } = require('../userlist');
const { getActiveGenfors } = require('../../../../models/meeting');
const { getUsers } = require('../../../../models/user');
const { generateUser, generateGenfors, generateSocket } = require('../../../../utils/generateTestData');

describe('requestUserList', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUsers.mockImplementation(async genfors => [
      generateUser({ genfors: genfors.id, _id: '1' }),
      generateUser({ genfors: genfors.id, _id: '2' }),
    ]);
  });

  const generateData = () => ({});

  it('emits user list action on success', async () => {
    const socket = generateSocket();
    await requestUserList(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when no active genfors was found', async () => {
    getActiveGenfors.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await requestUserList(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when retrieving users fails', async () => {
    getUsers.mockImplementation(async () => { throw new Error('Failed'); });
    const socket = generateSocket();
    await requestUserList(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
