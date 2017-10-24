jest.mock('../../../models/meeting');
const { endGAM, toggleRegistration } = require('../meeting');
const { getGenfors, getActiveGenfors, updateGenfors } = require('../../../models/meeting');
const { generateSocket, generateGenfors, generateUser } = require('../../../utils/generateTestData');
const permissionLevels = require('../../../../common/auth/permissions');

describe('toggleRegistration', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    updateGenfors.mockImplementation(async (genfors, data) =>
      ({ ...genfors, ...data, pin: genfors.pin }));
  });

  const generateData = data => (Object.assign({
    registrationOpen: true,
  }, data));

  it('emits a toggle action that closes registration', async () => {
    const socket = generateSocket();
    await toggleRegistration(socket, generateData());

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });

  it('emits a toggle action that opens registration', async () => {
    const socket = generateSocket();
    await toggleRegistration(socket, generateData({ registrationOpen: false }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});

describe('endGAM', () => {
  beforeAll(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    updateGenfors.mockImplementation(async (genfors, data) =>
      generateGenfors({ ...genfors, ...data, pin: genfors.pin }));
  });

  it('closes meeting if requested', async () => {
    const socket = generateSocket(generateUser({ permissions: permissionLevels.IS_MANAGER }));
    const genfors = generateGenfors();
    getActiveGenfors.mockImplementation(async () => genfors);
    getGenfors.mockImplementation(async () => genfors);

    await endGAM(socket);

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
  });
});
