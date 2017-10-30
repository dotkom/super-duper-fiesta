jest.mock('../../models/meeting');
jest.mock('../../models/user');
const { register } = require('../auth');
const { getActiveGenfors } = require('../../models/meeting');
const { getAnonymousUser, addAnonymousUser, getUserByUsername } = require('../../models/user');
const { generateGenfors, generateSocket, generateAnonymousUser, generateUser } = require('../../utils/generateTestData');

beforeEach(() => {
  getActiveGenfors.mockImplementation(async () => generateGenfors({ pin: 1234567890 }));
  getAnonymousUser.mockImplementation(async () => null);
  addAnonymousUser.mockImplementation(
    async () => {},
  );
  getUserByUsername.mockImplementation(async (username, genfors) =>
    generateUser({ username, genfors, completedRegistration: false }));
});

const generateData = data => (Object.assign({
  pin: 1234567890,
  passwordHash: null,
}, data));


describe('register', () => {
  it('emits registration status', async () => {
    const socket = generateSocket({ completedRegistration: false });
    await register(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });

  it('emits error when registration is closed', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ registrationOpen: false }));
    const socket = generateSocket({ completedRegistration: false });
    await register(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when pin code is wrong', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ pin: 5453577654 }));
    const socket = generateSocket({ completedRegistration: false });
    await register(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });


  it('emits error when user is already registered with wrong personal code', async () => {
    const socket = generateSocket({ completedRegistration: true }, { passwordHash: 'correct' });
    await register(
      socket,
      generateData({ passwordHash: 'wrong' }),
    );

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });


  it('emits registered when user is already registered with correct personal code', async () => {
    getAnonymousUser.mockImplementation(
      async (passwordHash, onlinewebId, genfors) => generateAnonymousUser({
        passwordHash,
        genfors,
      },
    ));
    const socket = generateSocket({ completedRegistration: true }, { passwordHash: 'correct' });
    await register(
      socket,
      generateData({ passwordHash: 'correct' }),
    );

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when handling errors when validating hash', async () => {
    getAnonymousUser.mockImplementation(
      async () => {
        throw new Error('Failed');
      },
    );
    const socket = generateSocket({ completedRegistration: true }, { passwordHash: 'correct' });
    await register(
      socket,
      generateData({ passwordHash: 'correct' }),
    );

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits error when handling errors when saving anonymous user', async () => {
    addAnonymousUser.mockImplementation(
      async () => {
        throw new Error('Failed');
      },
    );
    const socket = generateSocket({ completedRegistration: false });
    await register(
      socket,
      generateData(),
    );

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
