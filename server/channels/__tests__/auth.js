jest.mock('../../utils');
jest.mock('../../models/meeting');
jest.mock('../../models/user');
const { emit, broadcast } = require('../../utils');
const { register } = require('../auth');
const { getActiveGenfors } = require('../../models/meeting');
const { getAnonymousUser, addAnonymousUser } = require('../../models/user');
const { generateGenfors, generateSocket, generateAnonymousUser } = require('../../utils/generateTestData');

beforeEach(() => {
  getActiveGenfors.mockImplementation(async () => generateGenfors({ pin: 1234567890 }));
  getAnonymousUser.mockImplementation(async () => null);
  addAnonymousUser.mockImplementation(
    async () => {},
  );
});

const generateData = data => (Object.assign({
  pin: 1234567890,
  passwordHash: null,
}, data));


describe('register', () => {
  it('emits registration status', async () => {
    await register(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when registration is closed', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ registrationOpen: false }));
    await register(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when pin code is wrong', async () => {
    getActiveGenfors.mockImplementation(async () => generateGenfors({ pin: 5453577654 }));
    await register(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });


  it('emits error when user is already registered with wrong personal code', async () => {
    await register(
      generateSocket({ completedRegistration: true }, { passwordHash: 'correct' }),
      generateData({ passwordHash: 'wrong' }),
    );

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });


  it('emits registered when user is already registered with correct personal code', async () => {
    getAnonymousUser.mockImplementation(
      async (passwordHash, onlinewebId, genfors) => generateAnonymousUser({
        passwordHash,
        genfors,
      },
    ));
    await register(
      generateSocket({ completedRegistration: true }, { passwordHash: 'correct' }),
      generateData({ passwordHash: 'correct' }),
    );

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when handling errors when validating hash', async () => {
    getAnonymousUser.mockImplementation(
      async () => {
        throw new Error('Failed');
      },
    );
    await register(
      generateSocket({ completedRegistration: true }, { passwordHash: 'correct' }),
      generateData({ passwordHash: 'correct' }),
    );

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when handling errors when saving anonymous user', async () => {
    addAnonymousUser.mockImplementation(
      async () => {
        throw new Error('Failed');
      },
    );
    await register(
      generateSocket(),
      generateData(),
    );

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});
