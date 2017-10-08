jest.mock('../../../utils');
jest.mock('../../../models/meeting');
const { broadcast, emit } = require('../../../utils');
const { toggleRegistration } = require('../meeting');
const { getActiveGenfors, toggleRegistrationStatus } = require('../../../models/meeting');
const { generateSocket, generateGenfors } = require('../../../utils/generateTestData');

describe('toggleRegistration', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    toggleRegistrationStatus.mockImplementation(
      async (genfors, registrationOpen) =>
        generateGenfors({ ...genfors, registrationOpen: !registrationOpen }));
  });

  const generateData = data => (Object.assign({
    registrationOpen: true,
  }, data));

  it('emits a toggle action that closes registration', async () => {
    await toggleRegistration(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits a toggle action that opens registration', async () => {
    await toggleRegistration(generateSocket(), generateData({ registrationOpen: false }));

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});
