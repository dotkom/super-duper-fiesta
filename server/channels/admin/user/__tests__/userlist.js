jest.mock('../../../../models/meeting');
jest.mock('../../../../models/user');
jest.mock('../../../../utils');
const { requestUserList } = require('../userlist');
const { emit, broadcast } = require('../../../../utils');
const { getActiveGenfors } = require('../../../../models/meeting');
const { getUsers } = require('../../../../models/user');
const { generateUser, generateGenfors, generateSocket } = require('../../../../utils/generateTestData');

describe('requestUserList', () => {
  beforeEach(() => {
    getActiveGenfors.mockImplementation(async () => generateGenfors());
    getUsers.mockImplementation(async genfors => [
      generateUser({ genfors: genfors.id, _id: '1' }),
      generateUser({ genfors: genfors.id, _id: '2' }),
    ]);
  });

  const generateData = () => ({});

  it('emits user list action on success', async () => {
    await requestUserList(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when no active genfors was found', async () => {
    getActiveGenfors.mockImplementation(async () => { throw new Error('Failed'); });
    await requestUserList(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });

  it('emits error when retrieving users fails', async () => {
    getUsers.mockImplementation(async () => { throw new Error('Failed'); });
    await requestUserList(generateSocket(), generateData());

    expect(emit.mock.calls).toMatchSnapshot();
    expect(broadcast.mock.calls).toEqual([]);
  });
});
