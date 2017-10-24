jest.mock('../meeting');
const { closeGenfors } = require('../meeting');
const { generateGenfors } = require('../../utils/generateTestData');

describe('close genfors', () => {
  beforeAll(() => {
    closeGenfors.mockImplementation(genfors => generateGenfors({ ...genfors, status: 'closed' }));
  });

  it('closes the current genfors', async () => {
    const genfors = generateGenfors();

    const updatedGenfors = await closeGenfors(genfors);

    expect(updatedGenfors).toMatchObject(Object.assign(genfors, { status: 'closed' }));
  });
});
