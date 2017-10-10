jest.mock('../../models/meeting');
jest.mock('../../utils');
const { emit, broadcast } = require('../../utils');
const { createGenfors } = require('../../models/meeting');
const { generateGenfors, generateSocket } = require('../../utils/generateTestData');
const { createGenfors: createGenforsListener } = require('../auth');

const generateData = data => Object.assign({}, data);

describe('admin', () => {
  it('returns invalid admin password if incorrect', async () => {
    process.env.SDF_GENFORS_ADMIN_PASSWORD = 'correct';

    await createGenforsListener(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);

    process.env.SDF_GENFORS_ADMIN_PASSWORD = '';
  });

  it('creates a new meeting if admin password is correct', async () => {
    createGenfors.mockImplementation(async () => generateGenfors());
    process.env.SDF_GENFORS_ADMIN_PASSWORD = 'correct';

    await createGenforsListener(generateSocket(), generateData({ password: 'correct' }));

    expect(emit.mock.calls).toEqual([]);
    expect(broadcast.mock.calls).toEqual([]);

    process.env.SDF_GENFORS_ADMIN_PASSWORD = '';
  });
});
