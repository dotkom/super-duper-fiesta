jest.mock('../../models/meeting');
jest.mock('../../models/user');
const { createGenfors } = require('../../models/meeting.accessors');
const { updateUserById } = require('../../models/user.accessors');
const { generateGenfors, generateSocket, generateUser } = require('../../utils/generateTestData');
const { adminLogin, createGenfors: createGenforsListener, listener } = require('../admin/authAdmin');
const { ADMIN_CREATE_GENFORS, ADMIN_LOGIN } = require('../../../common/actionTypes/auth');

const MOCK_PW = 'correct';

const generateData = data => Object.assign({}, data);

beforeEach(() => {
  process.env.SDF_GENFORS_ADMIN_PASSWORD = MOCK_PW;
});

describe('admin login', () => {
  it('returns invalid admin password if incorrect', async () => {
    const socket = generateSocket();
    await adminLogin(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits sign in with manager permissions if auth successful', async () => {
    updateUserById.mockImplementation(async (id, obj) => Object.assign(generateUser(), obj));
    const user = { permissions: 0 };
    const socket = generateSocket(user);
    await adminLogin(socket, generateData({ password: MOCK_PW }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});

describe('admin creates genfors', () => {
  it('returns invalid admin password if incorrect', async () => {
    const socket = generateSocket();
    await createGenforsListener(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('creates a new meeting if admin password is correct', async () => {
    createGenfors.mockImplementation(async () => generateGenfors());

    const socket = generateSocket();
    await createGenforsListener(socket, generateData({ password: MOCK_PW }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });
});

describe('listener', () => {
  it('listens to ADMIN_CREATE_GENFORS', async () => {
    createGenfors.mockImplementation(async () => generateGenfors());
    const socket = generateSocket();
    await listener(socket);

    await socket.createAction(generateData({ type: ADMIN_CREATE_GENFORS }));

    expect(socket.emit).toBeCalled();
  });

  it('listens to ADMIN_LOGIN', async () => {
    const socket = generateSocket();
    await listener(socket);

    await socket.createAction(generateData({ type: ADMIN_LOGIN }));

    expect(socket.emit).toBeCalled();
  });

  it('ignores INVALID_ACTION', async () => {
    const socket = generateSocket();
    await listener(socket);

    await socket.createAction(generateData({ type: 'INVALID_ACTION' }));

    expect(socket.emit).not.toBeCalled();
    expect(socket.broadcast.emit).not.toBeCalled();
  });
});


afterEach(() => {
  process.env.SDF_GENFORS_ADMIN_PASSWORD = '';
});
