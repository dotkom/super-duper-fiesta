jest.mock('../../models/meeting');
jest.mock('../../utils');
const { emit, broadcast } = require('../../utils');
const { createGenfors } = require('../../models/meeting');
const { generateGenfors, generateSocket } = require('../../utils/generateTestData');
const { createGenfors: createGenforsListener } = require('../auth');


const MOCK_PW = 'correct';

const generateData = data => Object.assign({}, data);

beforeEach(() => {
  process.env.SDF_GENFORS_ADMIN_PASSWORD = MOCK_PW;
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
