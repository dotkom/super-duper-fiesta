jest.mock('../../../models/meeting.accessors');
const { listener, endGAM, toggleRegistration } = require('../meeting');
const { getGenfors, getActiveGenfors, updateGenfors } = require('../../../models/meeting.accessors');
const { generateSocket, generateGenfors, generateUser } = require('../../../utils/generateTestData');
const permissionLevels = require('../../../../common/auth/permissions');
const { ADMIN_END_MEETING, TOGGLE_REGISTRATION_STATE } = require('../../../../common/actionTypes/meeting');

describe('toggleRegistration', () => {
  beforeEach(() => {
    const genfors = generateGenfors();
    getActiveGenfors.mockImplementation(async () => genfors);
    updateGenfors.mockImplementation(async (_, data) =>
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
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });

  it('emits a toggle action that opens registration', async () => {
    const socket = generateSocket();
    await toggleRegistration(socket, generateData({ registrationOpen: false }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toMatchSnapshot();
  });

  it('responds with an error if something wrong happens', async () => {
    updateGenfors.mockImplementation(() => { throw new Error('Something wrong happened'); });

    const socket = generateSocket();
    await toggleRegistration(socket, generateData({ registrationOpen: false }));

    expect(socket.emit.mock.calls).toMatchSnapshot();
    expect(socket.broadcast.emit.mock.calls).toMatchSnapshot();
    expect(socket.to('admin').emit.mock.calls).toEqual([]);
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
    expect(socket.to('admin').emit.mock.calls).toEqual([]);
  });
});

function generateSocketData(data) {
  return { type: '', ...data };
}

describe('listener', () => {
  it('listens to ADMIN_END_MEETING', async (done) => {
    const socket = generateSocket({ permissions: permissionLevels.IS_MANAGER });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: ADMIN_END_MEETING }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('listens to TOGGLE_REGISTRATION_STATE', async (done) => {
    const socket = generateSocket({ permissions: permissionLevels.IS_MANAGER });
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: TOGGLE_REGISTRATION_STATE }));

    setTimeout(() => {
      expect(socket.emit).toBeCalled();
      expect(socket.broadcast.emit).toBeCalled();
      done();
    });
  });

  it('ignores INVALID_ACTION', async () => {
    const socket = generateSocket();
    await listener(socket);

    await socket.mockEmit('action', generateSocketData({ type: 'INVALID_ACTION' }));

    expect(socket.emit).not.toBeCalled();
    expect(socket.broadcast.emit).not.toBeCalled();
  });
});
