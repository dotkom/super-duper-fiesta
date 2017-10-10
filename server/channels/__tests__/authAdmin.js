jest.mock('../../models/meeting');
jest.mock('../../models/user');
jest.mock('../../utils');
const { emit, broadcast } = require('../../utils');
const { createGenfors } = require('../../models/meeting');
const { updateUserById } = require('../../models/user');
const { generateGenfors, generateSocket, generateUser } = require('../../utils/generateTestData');
const { adminLogin, createGenfors: createGenforsListener } = require('../auth');


const MOCK_PW = 'correct';

const generateData = data => Object.assign({}, data);

beforeEach(() => {
  process.env.SDF_GENFORS_ADMIN_PASSWORD = MOCK_PW;
});

describe('admin login', () => {
  it('returns invalid admin password if incorrect', async () => {
    await adminLogin(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits sign in with manager permissions if auth successful', async () => {
    updateUserById.mockImplementation(async (id, obj) => Object.assign(generateUser(), obj));
    const user = { permissions: 0 };
    await adminLogin(generateSocket(user),
                     generateData({ password: MOCK_PW }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});

describe('admin creates genfors', () => {
  it('returns invalid admin password if incorrect', async () => {
    await createGenforsListener(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('creates a new meeting if admin password is correct', async () => {
    createGenfors.mockImplementation(async () => generateGenfors());

    await createGenforsListener(generateSocket(), generateData({ password: MOCK_PW }));

    expect(emit.mock.calls).toEqual([]);
    expect(broadcast.mock.calls).toEqual([]);
  });
});

afterEach(() => {
  process.env.SDF_GENFORS_ADMIN_PASSWORD = '';
});
