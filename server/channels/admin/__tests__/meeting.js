jest.mock('../../../models/meeting');
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
    const socket = generateSocket();
    await toggleRegistration(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });

  it('emits a toggle action that opens registration', async () => {
    const socket = generateSocket();
    await toggleRegistration(socket, generateData({ registrationOpen: false }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toEqual([]);
  });
});
