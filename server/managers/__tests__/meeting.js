jest.mock('../../models/meeting');
const { endGenfors } = require('../meeting');
const { closeGenfors } = require('../../models/meeting');
const { generateGenfors, generateUser } = require('../../utils/generateTestData');
const permissionLevels = require('../../../common/auth/permissions');

describe('endGenfors', () => {
  beforeAll(() => {
    closeGenfors.mockImplementation(genfors => generateGenfors({ ...genfors, status: 'closed' }));
  });

  it('ends the current genfors if user has rights to do so', async () => {
    const genfors = generateGenfors();

    const updatedGenfors = await endGenfors(genfors,
      generateUser({ permissions: permissionLevels.IS_SUPERUSER }));

    expect(updatedGenfors).toMatchObject(Object.assign(genfors, { status: 'closed' }));
  });
});
